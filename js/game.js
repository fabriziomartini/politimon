const state = {
    screen: 'title',
    selectedParty: null,
    coalition: [],
    maxExtra: 3,
    electionResult: null
};

function getOwnPoliticians() {
    return POLITICIANS.filter(p => p.partito === state.selectedParty.id);
}

function getCoalitionPoliticians() {
    return state.coalition.map(id => POLITICIANS.find(p => p.id === id)).filter(Boolean);
}

function coalitionSeats() {
    return getCoalitionPoliticians().reduce((s, p) => s + p.seggi, 0);
}

function statBars(p) {
    return `
        <div class="stat-bar">
            <span class="stat-label">Carisma</span>
            <div class="stat-track"><div class="stat-fill carisma" style="width:${p.carisma * 10}%"></div></div>
            <span class="stat-val">${p.carisma}</span>
        </div>
        <div class="stat-bar">
            <span class="stat-label">Fedeltà</span>
            <div class="stat-track"><div class="stat-fill fedelta" style="width:${p.fedelta * 10}%"></div></div>
            <span class="stat-val">${p.fedelta}</span>
        </div>
        <div class="stat-bar">
            <span class="stat-label">Scandali</span>
            <div class="stat-track"><div class="stat-fill scandali" style="width:${p.scandali * 10}%"></div></div>
            <span class="stat-val">${p.scandali}</span>
        </div>
        <div class="stat-bar">
            <span class="stat-label">Potere</span>
            <div class="stat-track"><div class="stat-fill potere" style="width:${p.potere * 10}%"></div></div>
            <span class="stat-val">${p.potere}</span>
        </div>`;
}

function politicoCard(p, mode) {
    const partyInfo = PARTIES.find(pt => pt.id === p.partito);
    const partyLabel = partyInfo
        ? `${partyInfo.emoji} ${partyInfo.sigla}`
        : (p.partito === 'iv' ? '🔄 IV' : p.partito === 'az' ? '🏗️ Az' : '🏛️ Indip.');
    const seatsLabel = p.seggi > 0 ? ` · ${p.seggi} seggi` : '';

    const isOwn = mode === 'own';
    const isSelected = state.coalition.includes(p.id);
    const ownIds = getOwnPoliticians().map(x => x.id);
    const extraCount = state.coalition.filter(id => !ownIds.includes(id)).length;
    const isLocked = !isSelected && !isOwn && extraCount >= state.maxExtra;

    let cls = 'politico-card';
    if (isOwn) cls += ' own';
    else if (isSelected) cls += ' selected';
    else if (isLocked) cls += ' locked';

    const action = (isOwn || isLocked) ? '' : 'toggle-politician';

    return `
        <div class="${cls}" data-action="${action}" data-id="${p.id}">
            <div class="selected-check">✓</div>
            <span class="politico-avatar">${p.emoji}</span>
            <div class="politico-name">${p.nome}</div>
            <div class="politico-partito">${partyLabel}${seatsLabel}</div>
            ${statBars(p)}
            <div class="quote-tag">${p.quote}</div>
        </div>`;
}

function seatsBar(seats) {
    const pct = Math.min(100, (seats / TOTAL_SEATS) * 100).toFixed(1);
    const hasMajority = seats >= MAJORITY;
    return `
        <div class="coalition-bar">
            <h3>📊 Seggi coalizione &nbsp;·&nbsp; Maggioranza: ${MAJORITY} / ${TOTAL_SEATS}</h3>
            <div class="seats-progress">
                <div class="seats-fill" style="width:${pct}%">${pct > 18 ? seats + ' seggi' : ''}</div>
                <div class="majority-line"></div>
            </div>
            <div class="seats-info">
                <span>${seats} seggi (${pct}%)</span>
                <span style="color:${hasMajority ? '#00c47a' : '#ff6b6b'}">
                    ${hasMajority ? '✅ Maggioranza raggiunta!' : '⚠️ Mancano ' + (MAJORITY - seats) + ' seggi'}
                </span>
            </div>
        </div>`;
}

/* ---------- SCREENS ---------- */

function screenTitle() {
    return `
        <div class="title">
            <h1>POLITIMON</h1>
            <p class="subtitle">🇮🇹 Il simulatore satirico della politica italiana</p>
            <p class="disclaimer">Puro gioco di fantasia · Solo a fini ludici e satirici</p>
            <button class="btn" data-action="goto-party-select">⚡ Inizia la Campagna</button>
        </div>`;
}

function screenPartySelect() {
    const cards = PARTIES.map(p => `
        <div class="party-card ${state.selectedParty?.id === p.id ? 'selected' : ''}"
             data-action="select-party" data-party="${p.id}">
            <span class="party-emoji">${p.emoji}</span>
            <div class="party-name">${p.sigla}</div>
            <div class="party-leader">${p.leader}</div>
            <div class="party-seats">${p.seggi} seggi</div>
            <div class="party-desc">${p.desc}</div>
        </div>`).join('');

    return `
        <div>
            <h2 class="section-title">🏛️ Scegli il tuo Partito</h2>
            <p class="section-sub">Guiderai questo partito alle elezioni — ogni partito ha i suoi politici fedeli (e i suoi scheletri nell'armadio)</p>
            <div class="parties-grid">${cards}</div>
            ${state.selectedParty ? `
                <div class="selected-info">
                    Hai scelto <strong>${state.selectedParty.nome}</strong> — Leader: ${state.selectedParty.leader}
                </div>` : ''}
            <div class="flex-row">
                <button class="btn secondary" data-action="goto-title">← Indietro</button>
                <button class="btn" data-action="goto-coalition" ${!state.selectedParty ? 'disabled' : ''}>
                    Forma la Coalizione →
                </button>
            </div>
        </div>`;
}

function screenCoalition() {
    const own = getOwnPoliticians();
    const ownIds = own.map(p => p.id);

    if (state.coalition.length === 0) {
        state.coalition = [...ownIds];
    }

    const extraSelected = state.coalition.filter(id => !ownIds.includes(id));
    const slotsLeft = state.maxExtra - extraSelected.length;
    const available = POLITICIANS.filter(p => p.partito !== state.selectedParty.id);

    return `
        <div>
            <h2 class="section-title">🤝 Forma la tua Coalizione</h2>
            <p class="section-sub">
                Recluta fino a <strong>${state.maxExtra}</strong> alleati da altri partiti.
                Attenzione: la fedeltà bassa può far cadere il governo!
            </p>

            ${seatsBar(coalitionSeats())}

            <p class="subheader">👑 Il tuo partito — ${state.selectedParty.sigla}</p>
            <div class="politicians-grid">${own.map(p => politicoCard(p, 'own')).join('')}</div>

            <p class="subheader">🤝 Alleati disponibili</p>
            <div class="slot-counter">Slot liberi: <strong>${slotsLeft}</strong> / ${state.maxExtra}</div>
            <div class="politicians-grid">${available.map(p => politicoCard(p, 'available')).join('')}</div>

            <div class="flex-row" style="margin-top:24px">
                <button class="btn secondary" data-action="goto-party-select">← Cambia Partito</button>
                <button class="btn" data-action="goto-election">🗳️ Vai alle Elezioni →</button>
            </div>
        </div>`;
}

function screenElection() {
    const pol = getCoalitionPoliticians();
    const seats = coalitionSeats();
    const avg = key => (pol.reduce((s, p) => s + p[key], 0) / pol.length).toFixed(1);
    const badges = pol.map(p => `<span class="badge">${p.emoji} ${p.nome}</span>`).join('');

    return `
        <div style="text-align:center;padding:40px 0">
            <h2 class="section-title">📋 Riepilogo Coalizione</h2>
            <p class="section-sub">Controlla la tua squadra — poi si vota!</p>

            <div style="display:inline-grid;grid-template-columns:1fr 1fr;gap:8px 32px;
                        background:var(--card-bg);border:2px solid var(--border);
                        border-radius:12px;padding:24px 32px;text-align:left;
                        margin-bottom:24px;font-size:0.92rem">
                <div>🏛️ <strong>Seggi totali:</strong> ${seats}</div>
                <div>👥 <strong>Politici:</strong> ${pol.length}</div>
                <div>✨ <strong>Carisma medio:</strong> ${avg('carisma')} / 10</div>
                <div>🤝 <strong>Fedeltà media:</strong> ${avg('fedelta')} / 10</div>
                <div>📰 <strong>Scandali medi:</strong> ${avg('scandali')} / 10</div>
                <div>💪 <strong>Potere medio:</strong> ${avg('potere')} / 10</div>
            </div>

            <div style="margin-bottom:32px;max-width:600px;margin-left:auto;margin-right:auto">${badges}</div>

            <div class="flex-row">
                <button class="btn secondary" data-action="goto-coalition">← Modifica</button>
                <button class="btn big" data-action="run-election">🗳️ VOTA!</button>
            </div>
        </div>`;
}

function screenResult() {
    const r = state.electionResult;
    return `
        <div class="result-screen">
            <span class="result-big">${r.emoji}</span>
            <h2 class="result-title">${r.title}</h2>
            <p class="result-desc">${r.desc}</p>
            <div class="result-stats">
                <div>🏛️ <strong>Seggi finali</strong></div>
                <div>${r.finalSeats} / ${TOTAL_SEATS}</div>
                <div>🎯 <strong>Maggioranza</strong></div>
                <div>${r.finalSeats >= MAJORITY ? '✅ Raggiunta' : '❌ Non raggiunta'}</div>
                <div>📣 <strong>Popolarità</strong></div>
                <div>${r.popularity}%</div>
                <div>🎲 <strong>Voto fortuna</strong></div>
                <div>${r.luck > 0 ? '+' : ''}${r.luck} seggi</div>
            </div>
            <div class="flex-row">
                <button class="btn" data-action="restart">🔄 Nuova Partita</button>
            </div>
        </div>`;
}

/* ---------- ELECTION LOGIC ---------- */

function runElection() {
    const pol = getCoalitionPoliticians();
    const seats = coalitionSeats();
    const avg = key => pol.reduce((s, p) => s + p[key], 0) / pol.length;

    const score = (avg('carisma') + avg('fedelta') + avg('potere') - avg('scandali') * 0.6) / 30;
    const luck = Math.round((Math.random() - 0.5) * 80);
    const finalSeats = Math.max(0, Math.min(TOTAL_SEATS, seats + Math.round(score * 60) + luck));
    const popularity = Math.round(Math.max(5, Math.min(95, score * 100 + (luck > 0 ? 5 : -5))));

    let emoji, title, desc;

    if (finalSeats >= MAJORITY + 100) {
        emoji = '🏆'; title = 'Vittoria Schiacciante!';
        desc = `Con ${finalSeats} seggi hai ottenuto una maggioranza storica. Il Presidente della Repubblica ti chiama entro l'ora. La nazione è tua... almeno per questa legislatura.`;
    } else if (finalSeats >= MAJORITY) {
        emoji = '🎉'; title = 'Governo Formato!';
        desc = `Ce l'hai fatta! ${finalSeats} seggi bastano per governare. Tieniti pronto: qualcuno della coalizione sta già trattando sottobanco con l'opposizione.`;
    } else if (finalSeats >= MAJORITY - 40) {
        emoji = '😰'; title = 'Quasi... Governo di Larghe Intese?';
        desc = `Solo ${MAJORITY - finalSeats} seggi ti separano dalla maggioranza. Mattarella ti convoca. Si aprono i giorni delle trattative, delle marchette e delle promesse impossibili.`;
    } else if (finalSeats >= 150) {
        emoji = '😬'; title = 'Opposizione Costruttiva';
        desc = `Non ce l'hai fatta. Ma non disperare — sei la prima opposizione e aspetti che il governo cada. Di solito non ci vuole molto.`;
    } else {
        emoji = '💀'; title = 'Disastro Elettorale';
        desc = `Una débâcle storica. Anche tua nonna ha votato diversamente. Il partito chiede le dimissioni. I giornali ti dedicano una prima pagina agghiacciante.`;
    }

    state.electionResult = { emoji, title, desc, finalSeats, popularity, luck };
    state.screen = 'result';
    render();
}

/* ---------- RENDER & EVENTS ---------- */

function render() {
    const app = document.getElementById('app');
    switch (state.screen) {
        case 'title':        app.innerHTML = screenTitle(); break;
        case 'party-select': app.innerHTML = screenPartySelect(); break;
        case 'coalition':    app.innerHTML = screenCoalition(); break;
        case 'election':     app.innerHTML = screenElection(); break;
        case 'result':       app.innerHTML = screenResult(); break;
    }
    document.querySelectorAll('[data-action]').forEach(el => {
        if (el.dataset.action) el.addEventListener('click', handleAction);
    });
}

function handleAction(e) {
    const action = e.currentTarget.dataset.action;
    if (!action) return;

    switch (action) {
        case 'goto-title':
            state.screen = 'title'; render(); break;

        case 'goto-party-select':
            state.screen = 'party-select'; render(); break;

        case 'select-party':
            state.selectedParty = PARTIES.find(p => p.id === e.currentTarget.dataset.party);
            render(); break;

        case 'goto-coalition':
            if (!state.selectedParty) return;
            state.coalition = [];
            state.screen = 'coalition'; render(); break;

        case 'toggle-politician': {
            const id = e.currentTarget.dataset.id;
            const ownIds = getOwnPoliticians().map(p => p.id);
            const extraSelected = state.coalition.filter(i => !ownIds.includes(i));
            if (state.coalition.includes(id)) {
                state.coalition = state.coalition.filter(i => i !== id);
            } else if (extraSelected.length < state.maxExtra) {
                state.coalition.push(id);
            }
            render(); break;
        }

        case 'goto-election':
            state.screen = 'election'; render(); break;

        case 'run-election':
            runElection(); break;

        case 'restart':
            state.screen = 'title';
            state.selectedParty = null;
            state.coalition = [];
            state.electionResult = null;
            render(); break;
    }
}

render();
