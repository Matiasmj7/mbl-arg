document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema MBL Arg Iniciado.");

    // --- BASE DE DATOS DE TORNEOS (Mock DB) ---
    const tournamentDB = {
        players: [
            { id: 1, name: 'Lunatico', wins: 45, losses: 5, mvp: 12 },
            { id: 2, name: 'PhantomKing', wins: 38, losses: 10, mvp: 8 },
            { id: 3, name: 'ShadowSlayer', wins: 30, losses: 15, mvp: 5 },
            { id: 4, name: 'NeonBlade', wins: 28, losses: 12, mvp: 6 },
            { id: 5, name: 'CrimsonGhost', wins: 22, losses: 20, mvp: 3 }
        ],
        lastTournament: {
            name: "Copa Konoha S1",
            results: [15, 12, 10, 8, 5] // Puntos obtenidos en el torneo
        }
    };

    // --- PERSISTENCIA DE TORNEOS GRATUITOS ---
    const defaultFreeTournaments = [
        { id: 'FT1', name: 'Copa Lunática #1', mode: '1v1', prize: 'Rango Especial', status: 'Abierta', startDate: '2026-05-10T20:00:00', maxSeats: 16, signedUp: 12 },
        { id: 'FT2', name: 'Duelos de Duos', mode: '2v2', prize: 'Skins Especiales', status: 'Abierta', startDate: '2026-05-15T18:00:00', maxSeats: 8, signedUp: 5 },
        { id: 'FT3', name: 'Scrims 3v3', mode: '3v3', prize: 'Fichaje Pro', status: 'Abierta', startDate: '2026-05-20T21:00:00', maxSeats: 32, signedUp: 30 },
        { id: 'FT4', name: 'Guerra Total 5v5', mode: '5v5', prize: 'Premio en ARS', status: 'Cerrada', startDate: '2026-04-20T20:00:00', maxSeats: 16, signedUp: 16 }
    ];

    const loadTournaments = () => {
        const stored = localStorage.getItem('mbl_free_tournaments');
        if(stored) {
            tournamentDB.freeTournaments = JSON.parse(stored);
        } else {
            tournamentDB.freeTournaments = defaultFreeTournaments;
            localStorage.setItem('mbl_free_tournaments', JSON.stringify(defaultFreeTournaments));
        }
    };

    const saveTournaments = () => {
        localStorage.setItem('mbl_free_tournaments', JSON.stringify(tournamentDB.freeTournaments));
    };

    loadTournaments();

    // --- RENDER TORNEOS GRATUITOS & CALENDARIO --- CHART.JS VISUALIZATION ---
    const initResultsChart = () => {
        const ctx = document.getElementById('resultsChart');
        if(!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: tournamentDB.players.map(p => p.name),
                datasets: [{
                    label: 'Puntos en el último Torneo',
                    data: tournamentDB.lastTournament.results,
                    backgroundColor: [
                        'rgba(255, 154, 0, 0.6)', // Naruto Orange
                        'rgba(0, 240, 255, 0.6)', // Neon Blue
                        'rgba(255, 0, 60, 0.6)',  // Neon Red
                        'rgba(135, 202, 250, 0.6)', // Celeste
                        'rgba(100, 200, 100, 0.6)'  // Genin Green
                    ],
                    borderColor: [
                        '#ff9a00', '#00f0ff', '#ff003c', '#87cefa', '#6c6'
                    ],
                    borderWidth: 2,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#fff', font: { family: 'Outfit' } }
                    }
                },
                scales: {
                    y: {
                        beginAtPoint: true,
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#888' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#fff' }
                    }
                }
            }
        });
    };

    initResultsChart();

    // --- NAVBAR & SCROLL ---
    const navLinks = document.getElementById('navLinks');
    const mobileToggle = document.getElementById('mobileToggle');
    const links = document.querySelectorAll('.nav-link');

    if(mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.classList.remove('open');
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('.section, .hero');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = '#' + section.getAttribute('id');
            }
        });
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });

    // --- LIBRO BINGO TABS ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = 'tab-' + btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- STREAM PLATFORMS ---
    const streamBtns = document.querySelectorAll('.stream-btn');
    const streamContainer = document.getElementById('streamContainer');

    const streamSources = {
        twitch: '<iframe src="https://player.twitch.tv/?channel=mobilelegendsesports&parent=localhost" frameborder="0" allowfullscreen="true" scrolling="no" height="100%" width="100%"></iframe>',
        youtube: '<iframe src="https://www.youtube.com/embed/live_stream?channel=UC8p-Lp0-2Y9Y58g_v6y0-qg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen height="100%" width="100%"></iframe>',
        kick: '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:15px;background:linear-gradient(rgba(0,0,0,0.5), rgba(0,80,0,0.3));border-radius:12px;padding:20px;">' +
                 '<i class="fas fa-bolt" style="font-size:3.5rem;color:#53fc18;filter:drop-shadow(0 0 10px rgba(83,252,24,0.5));"></i>' +
                 '<h3 style="color:var(--white);font-size:1.5rem;">Canal Oficial: Lunatico7</h3>' +
                 '<p style="color:var(--gray);text-align:center;max-width:500px;">Disfrutá del streaming en <b>Kick</b> con la mejor calidad. Mirá el directo o los VODs pasados.</p>' +
                 '<div style="display:flex;gap:15px;margin-top:10px;">' +
                 '<a href="https://kick.com/Lunatico7" target="_blank" class="btn btn-primary" style="background:#53fc18; color:#000;"><i class="fas fa-play"></i> Ver en Kick</a>' +
                 '<a href="https://kick.com/Lunatico7/videos" target="_blank" class="btn btn-outline"><i class="fas fa-history"></i> Ver Repeticiones</a>' +
                 '</div>' +
                 '<p style="color:var(--gray);font-size:0.7rem;margin-top:15px;opacity:0.6;">(Click para abrir tu canal oficial de Kick en una nueva pestaña)</p>' +
                 '</div>',
        facebook: '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--gray);">[Stream de Facebook requiere SDK oficial para embeber]</div>',
        tiktok: '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:15px;background:linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7));border-radius:12px;padding:20px;">' +
                 '<i class="fab fa-tiktok" style="font-size:3.5rem;color:var(--naruto-orange);filter:drop-shadow(0 0 10px rgba(255,165,0,0.5));"></i>' +
                 '<h3 style="color:var(--white);font-size:1.5rem;">Canal Oficial: @eltioobi</h3>' +
                 '<p style="color:var(--gray);text-align:center;max-width:500px;">Hacé clic abajo para ver el <b>Directo</b> o mis últimos <b>Videos</b> directamente en TikTok.</p>' +
                 '<div style="display:flex;gap:15px;margin-top:10px;">' +
                 '<a href="https://www.tiktok.com/@eltioobi/live" target="_blank" class="btn btn-primary" style="background:var(--neon-red);"><i class="fas fa-play"></i> Ver Directo</a>' +
                 '<a href="https://www.tiktok.com/@eltioobi" target="_blank" class="btn btn-outline"><i class="fas fa-film"></i> Ver Videos</a>' +
                 '</div>' +
                 '<p style="color:var(--gray);font-size:0.7rem;margin-top:15px;opacity:0.6;">(TikTok requiere apertura en nueva pestaña para mayor calidad de streaming)</p>' +
                 '</div>'
    };

    streamBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            streamBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const platform = btn.getAttribute('data-platform');
            if(streamSources[platform]) {
                streamContainer.innerHTML = streamSources[platform];
            }
        });
    });

    // --- TORNEOS MODE SELECTOR ---
    const modeBtns = document.querySelectorAll('.mode-btn');
    const modeDetails = document.querySelectorAll('.mode-detail');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            modeDetails.forEach(d => d.classList.remove('active'));
            btn.classList.add('active');
            const modeId = 'mode-' + btn.getAttribute('data-mode');
            document.getElementById(modeId).classList.add('active');
        });
    });

    // --- SISTEMA DE INSCRIPCIONES (Local DB) ---
    const saveTournamentSignup = (playerData) => {
        const signups = JSON.parse(localStorage.getItem('tournament_signups')) || [];
        signups.push({
            ...playerData,
            date: new Date().toISOString(),
            status: 'pendiente'
        });
        localStorage.setItem('tournament_signups', JSON.stringify(signups));
    };

    // --- VERIFY FORM & TOURNAMENT SIGNUP ---
    const verifyForm = document.getElementById('verifyForm');
    if(verifyForm) {
        verifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nick = verifyForm.querySelector('input[type="text"]').value;
            const id = verifyForm.querySelectorAll('input[type="text"]')[1].value;
            const rank = verifyForm.querySelector('select').value;
            
            // Guardar en Base de Datos Interna
            saveTournamentSignup({ nickname: nick, gameId: id, rank: rank, type: 'Gratuito' });
            
            alert('✅ ¡Inscripción Guardada en el Sistema! Se abrirá WhatsApp para el envío formal.');
            
            const msg = encodeURIComponent(
                `📢 NUEVA INSCRIPCIÓN A TORNEO (GRATIS)\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `👤 Nickname: ${nick}\n` +
                `🆔 ID: ${id}\n` +
                `🎖️ Rango: ${rank}\n` +
                `🚀 Listo para la competición.`
            );
            window.open(`https://wa.me/541165658881?text=${msg}`, '_blank');
            verifyForm.reset();
        });
    }

    // --- PROMO FORM ---
    const promoForm = document.getElementById('promoForm');
    if(promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const wr = promoForm.querySelector('input[type="number"]').value;
            const matches = promoForm.querySelectorAll('input[type="number"]')[1].value;
            const role = promoForm.querySelector('select').value;
            
            alert('¡Perfil enviado! Se abrirá WhatsApp para postularte a la comunidad.');
            
            const msg = encodeURIComponent(
                `🔥 NUEVA POSTULACIÓN DE JUGADOR\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `👥 Comunidad: MBLARG\n` +
                `📂 Subgrupo: Inscripciones a torneos\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `📊 Winrate: ${wr}%\n` +
                `🎮 Partidas: ${matches}\n` +
                `⚔️ Rol: ${role}\n` +
                `🚀 Listo para el combate.`
            );
            window.open(`https://wa.me/541165658881?text=${msg}`, '_blank');
            promoForm.reset();
        });
    }

    // --- RENDER TORNEOS GRATUITOS & CALENDARIO ---
    const freeTournamentsList = document.getElementById('freeTournamentsList');
    const calendarGrid = document.getElementById('calendarGrid');
    const mySignupsSection = document.getElementById('mySignupsSection');
    const mySignupsList = document.getElementById('mySignupsList');

    const renderFreeTournaments = () => {
        if(!freeTournamentsList) return;
        freeTournamentsList.innerHTML = tournamentDB.freeTournaments.map(t => {
            const isFull = t.signedUp >= t.maxSeats;
            return `
                <div class="ninja-card chidori-frame" style="border-color: ${t.status === 'Abierta' && !isFull ? 'var(--neon-blue)' : 'var(--gray)'};">
                    <div class="card-avatar"><i class="fas fa-medal"></i></div>
                    <h3>${t.name}</h3>
                    <p class="card-role">Modalidad: ${t.mode}</p>
                    <div style="margin: 10px 0;">
                        <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${(t.signedUp/t.maxSeats)*100}%; height: 100%; background: var(--neon-blue); box-shadow: 0 0 10px var(--neon-blue);"></div>
                        </div>
                        <p style="font-size: 0.7rem; color: var(--gray); margin-top: 5px;">Plazas: ${t.signedUp} / ${t.maxSeats}</p>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--gray); margin-bottom: 15px;">Premio: ${t.prize}.</p>
                    ${(t.status === 'Abierta' && !isFull) ? 
                        `<button class="btn btn-glow btn-full" onclick="joinTournament('${t.id}', '${t.name}')">Inscribirse Gratis</button>` : 
                        `<button class="btn btn-outline btn-full" disabled>${isFull ? 'Cupos Llenos' : 'Cerrado'}</button>`}
                </div>
            `;
        }).join('');
        
        renderCalendar();
    };

    const renderCalendar = () => {
        if(!calendarGrid) return;
        calendarGrid.innerHTML = tournamentDB.freeTournaments.map(t => `
            <div class="ninja-card" style="background: rgba(0,0,0,0.4);">
                <div style="font-size: 0.7rem; color: var(--naruto-orange); text-transform: uppercase;">Próximo Evento</div>
                <h4 style="margin: 5px 0;">${t.name}</h4>
                <div class="countdown-timer" data-date="${t.startDate}" id="timer-${t.id}" style="font-family: monospace; font-size: 1.2rem; color: var(--neon-blue); margin: 10px 0;">
                    --:--:--:--
                </div>
                <div style="font-size: 0.7rem; color: var(--gray);">Fecha: ${new Date(t.startDate).toLocaleString()}</div>
            </div>
        `).join('');
    };

    const updateCountdowns = () => {
        const timers = document.querySelectorAll('.countdown-timer');
        timers.forEach(timer => {
            const targetDate = new Date(timer.getAttribute('data-date')).getTime();
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                timer.innerHTML = "¡EN CURSO!";
                timer.style.color = "var(--neon-red)";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        });
    };

    setInterval(updateCountdowns, 1000);

    window.joinTournament = (id, name) => {
        const currentUser = sessionStorage.getItem('currentUser');
        if(!currentUser) {
            alert('❌ Debes iniciar sesión para inscribirte.');
            btnAuth.click();
            return;
        }

        const tIdx = tournamentDB.freeTournaments.findIndex(t => t.id === id);
        const t = tournamentDB.freeTournaments[tIdx];

        if(t.signedUp >= t.maxSeats) {
            alert('⚠️ ¡CUPOS LLENOS! Ya no quedan plazas para este torneo.');
            return;
        }

        let myInscriptions = JSON.parse(localStorage.getItem('my_inscriptions')) || [];
        if(myInscriptions.some(i => i.id === id)) {
            alert('Ya estás inscripto en este torneo.');
            return;
        }

        // Actualizar Cupos
        tournamentDB.freeTournaments[tIdx].signedUp++;
        
        myInscriptions.push({ id, name, date: new Date().toLocaleDateString() });
        localStorage.setItem('my_inscriptions', JSON.stringify(myInscriptions));
        
        saveTournamentSignup({ nickname: JSON.parse(currentUser).user, gameId: 'USER', rank: 'PLAYER', type: `Gratis - ${name}` });
        
        alert(`✅ ¡Te has inscripto con éxito a ${name}!\nCupo reservado: ${tournamentDB.freeTournaments[tIdx].signedUp}/${t.maxSeats}`);
        
        // Alarma Admin si se llena
        if(tournamentDB.freeTournaments[tIdx].signedUp === t.maxSeats) {
            alert(`🚨 ALARMA KAGE: El torneo "${name}" ha completado sus cupos (${t.maxSeats}/${t.maxSeats}).\nDescargando lista oficial de combatientes...`);
            
            const allSignups = JSON.parse(localStorage.getItem('tournament_signups')) || [];
            const thisTourneySignups = allSignups.filter(s => s.type.includes(name));
            
            let fileContent = `📜 LISTA OFICIAL DE INSCRIPTOS - ${name.toUpperCase()}\n`;
            fileContent += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            fileContent += `FECHA DE CIERRE: ${new Date().toLocaleString()}\n`;
            fileContent += `CUPOS COMPLETADOS: ${t.maxSeats}/${t.maxSeats}\n\n`;
            
            thisTourneySignups.forEach((s, i) => {
                fileContent += `${i+1}. [${s.rank}] ${s.nickname} (ID: ${s.gameId})\n`;
            });
            
            fileContent += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            fileContent += `MBL ARG - EL ABISMO TE ESPERA`;

            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inscriptos_${name.replace(/\s+/g, '_').toLowerCase()}.txt`;
            a.click();
            window.URL.revokeObjectURL(url);
        }

        renderFreeTournaments();
        renderMyInscriptions();
    };

    const renderMyInscriptions = () => {
        const currentUser = sessionStorage.getItem('currentUser');
        if(!currentUser) {
            mySignupsSection.classList.add('hidden');
            return;
        }

        const myInscriptions = JSON.parse(localStorage.getItem('my_inscriptions')) || [];
        mySignupsSection.classList.toggle('hidden', myInscriptions.length === 0);
        
        if(mySignupsList) {
            mySignupsList.innerHTML = myInscriptions.map(t => `
                <div class="ninja-card" style="border-color: var(--neon-red);">
                    <div class="card-avatar"><i class="fas fa-check-circle"></i></div>
                    <h3>${t.name}</h3>
                    <p class="card-role">Fecha: ${t.date}</p>
                    <button class="btn btn-outline btn-full" style="border-color:var(--neon-red); color:var(--neon-red);" onclick="withdrawTournament('${t.id}')">
                        <i class="fas fa-user-minus"></i> Darse de Baja
                    </button>
                </div>
            `).join('');
        }
    };

    window.withdrawTournament = (id) => {
        if(!confirm('¿Estás seguro de darte de baja? Perderás tus puntos o tu lugar en el bracket.')) return;
        
        let myInscriptions = JSON.parse(localStorage.getItem('my_inscriptions')) || [];
        myInscriptions = myInscriptions.filter(i => i.id !== id);
        localStorage.setItem('my_inscriptions', JSON.stringify(myInscriptions));

        // Liberar cupo en la DB
        const tIdx = tournamentDB.freeTournaments.findIndex(t => t.id === id);
        if(tIdx !== -1 && tournamentDB.freeTournaments[tIdx].signedUp > 0) {
            tournamentDB.freeTournaments[tIdx].signedUp--;
            saveTournaments();
        }
        
        alert('Te has dado de baja. Tu plaza ha sido liberada.');
        renderFreeTournaments();
        renderMyInscriptions();
    };

    window.addEventListener('simulateQuota', () => {
        const t = tournamentDB.freeTournaments[0];
        t.signedUp = t.maxSeats - 1;
        renderFreeTournaments();
        alert(`🎮 MODO DEMO ACTIVADO 🎮\nSe han llenado ${t.signedUp} cupos de "${t.name}".\n¡Ahora inscribite vos para activar la ALARMA DE CUPO COMPLETO!`);
    });

    renderFreeTournaments();
    renderMyInscriptions();

    // --- TAVERN CHAT ---
    const chatLoginBtn = document.getElementById('chatJoinBtn');
    const chatNickname = document.getElementById('chatNickname');
    const chatLogin = document.getElementById('chatLogin');
    const chatRoom = document.getElementById('chatRoom');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');

    let currentUser = '';

    if(chatLoginBtn) {
        chatLoginBtn.addEventListener('click', () => {
            if(chatNickname.value.trim().length > 0) {
                currentUser = chatNickname.value.trim();
                chatLogin.classList.add('hidden');
                chatRoom.classList.remove('hidden');
                addChatMessage('Sistema', `${currentUser} ha ingresado a la taberna.`, true);
            }
        });
    }

    const addChatMessage = (user, text, isSystem = false) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isSystem ? 'system' : ''}`;
        
        // Mock Toxicity Filter
        if(text.toLowerCase().includes('manco') || text.toLowerCase().includes('basura')) {
            msgDiv.classList.add('toxic');
            text = '[Mensaje moderado por toxicidad]';
        }

        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        msgDiv.innerHTML = `
            <div class="msg-user">${user}</div>
            <div class="msg-text">${text}</div>
            <div class="msg-time">${time}</div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    if(chatSendBtn) {
        chatSendBtn.addEventListener('click', () => {
            if(chatInput.value.trim() !== '') {
                addChatMessage(currentUser, chatInput.value);
                chatInput.value = '';
            }
        });
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') chatSendBtn.click();
        });
    }

    // --- MERCADO DE FICHAJES (DUAL ENGINE) ---
    const marketGrid = document.getElementById('marketGrid');
    const filterRole = document.getElementById('filterRole');
    const filterTier = document.getElementById('filterTier');
    const filterSearch = document.getElementById('filterSearch');
    const suggestedGrid = document.getElementById('suggestedGrid');
    const matchmakingSection = document.getElementById('matchmakingSection');
    const matchmakingDesc = document.getElementById('matchmakingDesc');
    const marketTabs = document.querySelectorAll('[data-market]');

    let currentMarketTab = 'players';

    const marketDB_Dual = {
        players: [
            { name: 'Xcalibur', roles: ['ADC', 'JUNGLA'], tier: 'jonin', tags: ['Busca Escuadrón', 'Agresivo'] },
            { name: 'IronWall', roles: ['TANKE'], tier: 'chunin', tags: ['Estratega', 'Main Tigreal'] },
            { name: 'NinjaPro', roles: ['JUNGLA', 'MIDLINE'], tier: 'kage', tags: ['Top Global', 'Streamer'] },
            { name: 'HealerOne', roles: ['SUPORT'], tier: 'genin', tags: ['Paciencia', 'Nuevo'] },
            { name: 'VoltEdge', roles: ['MIDLINE', 'ADC'], tier: 'jonin', tags: ['Busca Team Pro'] }
        ],
        squads: [
            { name: 'ARG Legends', lookingFor: ['TANKE', 'SUPORT'], tier: 'jonin', members: 12 },
            { name: 'Team Abismo', lookingFor: ['JUNGLA'], tier: 'kage', members: 8 },
            { name: 'Konoha Force', lookingFor: ['MIDLINE', 'ADC'], tier: 'chunin', members: 15 }
        ]
    };

    const renderMarket = () => {
        if(!marketGrid) return;
        marketGrid.innerHTML = '';
        const roleVal = filterRole.value;
        const tierVal = filterTier.value;
        const searchVal = filterSearch ? filterSearch.value.toLowerCase() : '';

        const data = marketDB_Dual[currentMarketTab];

        data.filter(item => {
            const itemRoles = item.roles || item.lookingFor || [];
            const matchesRole = roleVal === 'all' || itemRoles.includes(roleVal);
            const matchesTier = tierVal === 'all' || item.tier === tierVal;
            const matchesSearch = item.name.toLowerCase().includes(searchVal);
            return matchesRole && matchesTier && matchesSearch;
        }).forEach(item => {
            const card = document.createElement('div');
            card.className = 'ninja-card';
            const rolesHtml = item.roles ? item.roles.join(' / ') : `Busca: ${item.lookingFor.join(' / ')}`;
            card.innerHTML = `
                <div class="card-avatar"><i class="fas ${item.roles ? 'fa-user-ninja' : 'fa-users'}"></i></div>
                <h3>${item.name}</h3>
                <p class="card-role">${rolesHtml}</p>
                <p style="font-size: 0.8rem; color: var(--gray); margin-bottom: 15px;">Tier: ${item.tier.toUpperCase()}</p>
                <button class="btn btn-outline btn-full" onclick="alert('Iniciando contacto con ${item.name}...')">Contactar</button>
            `;
            marketGrid.appendChild(card);
        });

        updateMatchmaking();
    };

    const updateMatchmaking = () => {
        const currentUserData = sessionStorage.getItem('currentUser');
        if(!currentUserData || !matchmakingSection) return;
        
        const user = JSON.parse(currentUserData);
        const userRoles = ['ADC', 'JUNGLA']; // Mock de roles del usuario logueado para la demo
        
        matchmakingSection.classList.remove('hidden');
        matchmakingDesc.innerHTML = `Basado en tus roles (<b>${userRoles.join(' / ')}</b>), estos escuadrones te necesitan:`;

        suggestedGrid.innerHTML = '';
        const suggestions = marketDB_Dual.squads.filter(sq => sq.lookingFor.some(role => userRoles.includes(role)));
        
        if(suggestions.length === 0) {
            suggestedGrid.innerHTML = '<p style="color:var(--gray); font-size:0.8rem;">No hay sugerencias exactas en este momento.</p>';
            return;
        }

        suggestions.forEach(sq => {
            const card = document.createElement('div');
            card.className = 'ninja-card';
            card.style.borderColor = 'var(--neon-blue)';
            card.innerHTML = `
                <div class="card-avatar" style="color:var(--neon-blue);"><i class="fas fa-wand-magic-sparkles"></i></div>
                <h3>${sq.name}</h3>
                <p class="card-role">Busca tu rol: ${sq.lookingFor.filter(r => userRoles.includes(r)).join(', ')}</p>
                <button class="btn btn-glow btn-full" onclick="alert('Postulándote a ${sq.name}...')">Postularse YA</button>
            `;
            suggestedGrid.appendChild(card);
        });
    };

    marketTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            marketTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMarketTab = tab.getAttribute('data-market');
            renderMarket();
        });
    });

    if(filterRole) filterRole.addEventListener('change', renderMarket);
    if(filterTier) filterTier.addEventListener('change', renderMarket);
    if(filterSearch) filterSearch.addEventListener('input', renderMarket);

    renderMarket();

    // --- FUNCIÓN DE NOTIFICACIÓN WHATSAPP ---
    const notifyWhatsApp = (concepto, monto) => {
        const phone = '541165658881';
        const msg = encodeURIComponent(
            `🏴 MBL Arg - Nuevo Pago\n\n` +
            `📌 Concepto: ${concepto}\n` +
            `💰 Monto: ${monto}\n` +
            `📅 Fecha: ${new Date().toLocaleString('es-AR')}\n\n` +
            `Adjunto comprobante de pago.`
        );
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    };

    // --- UNIFIED PAYMENT SYSTEM ---
    const paymentModal = document.getElementById('paymentModal');
    const closePayment = document.getElementById('closePayment');
    const paymentStep1 = document.getElementById('paymentStep1');
    const paymentStep2 = document.getElementById('paymentStep2');
    const paymentTitle = document.getElementById('paymentTitle');
    const paymentAmount = document.getElementById('paymentAmount');
    const benefitsDisplay = document.getElementById('benefitsDisplay');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

    let currentPlan = null;

    window.openPayment = (plan, price, benefits) => {
        currentPlan = { plan, price, benefits };
        paymentTitle.innerText = `Contratar ${plan}`;
        paymentAmount.innerText = price;
        paymentStep1.classList.remove('hidden');
        paymentStep2.classList.add('hidden');
        paymentModal.classList.remove('hidden');
    };

    window.copyAlias = (text) => {
        navigator.clipboard.writeText(text);
        alert('✅ Alias copiado al portapapeles.');
    };

    window.toggleAlias = (id, realValue, btn) => {
        const el = document.getElementById(id);
        const icon = btn.querySelector('i');
        
        if(el.classList.contains('masked')) {
            el.innerText = realValue;
            el.classList.remove('masked');
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            el.innerText = '••••••••';
            el.classList.add('masked');
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    };

    if(confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            notifyWhatsApp(`Pago por ${currentPlan.plan}`, currentPlan.price);
            
            // Simular avance al paso 2 (Beneficios)
            paymentStep1.classList.add('hidden');
            paymentStep2.classList.remove('hidden');
            
            // Mostrar beneficios
            benefitsDisplay.innerHTML = currentPlan.benefits.map(b => `<li><i class="fas fa-check"></i> ${b}</li>`).join('');
            
            // Si es un torneo, registrar automáticamente
            if(currentPlan.plan.includes('Kage') || currentPlan.plan.includes('Aliado')) {
                saveTournamentSignup({ 
                    nickname: 'Nuevo Suscriptor', 
                    gameId: 'SUBS-' + Math.floor(Math.random()*1000), 
                    rank: currentPlan.plan.toUpperCase(), 
                    type: 'Pago (Suscripción)' 
                });
                if(typeof renderSignupsAdmin === 'function') renderSignupsAdmin();
            }
        });
    }

    if(closePayment) closePayment.addEventListener('click', () => paymentModal.classList.add('hidden'));

    // --- BATTLE BEATS ---
    const beatAddBtn = document.getElementById('beatAddBtn');
    const beatUrl = document.getElementById('beatUrl');
    if(beatAddBtn) {
        beatAddBtn.addEventListener('click', () => {
            if(beatUrl.value.includes('youtube.com') || beatUrl.value.includes('youtu.be')) {
                openPayment('Battle Beats', '$200 ARS', ['Canción agregada a la cola', 'Prioridad de reproducción', 'Mención en vivo']);
            } else {
                alert('Por favor, ingresá un link válido de YouTube.');
            }
        });
    }

    // --- PLANES (ALIADOS) ---
    const planAliadoBtn = document.getElementById('planAliadoBtn');
    const planKageBtn = document.getElementById('planKageBtn');

    if(planAliadoBtn) {
        planAliadoBtn.addEventListener('click', () => {
            openPayment('Plan Aliado', '$3.000 ARS / $3 USD', ['Acceso a Torneos 1v1 y 2v2', 'Rango Aliado en el Chat', 'Notificaciones Exclusivas']);
        });
    }

    if(planKageBtn) {
        planKageBtn.addEventListener('click', () => {
            openPayment('Plan Kage Elite', '$8.000 ARS / $10 USD', ['Inscripción 3v3 y 5v5', 'Soporte Premium 24/7', 'Panel de Estadísticas Avanzado', 'Acceso IA Kage Assistant']);
        });
    }

    // --- DONACIONES ---
    const donateBtn = document.getElementById('donateBtn');
    if(donateBtn) {
        donateBtn.addEventListener('click', () => {
            const amount = document.getElementById('donateAmount');
            const amountVal = amount ? amount.value : 'Libre';
            alert('❤️ ¡Gracias por tu donación!\n\n' +
                '📲 Datos para donar:\n' +
                '━━━━━━━━━━━━━━━━━━━━━━\n' +
                '🇦🇷 ARS → Alias: matias.mj7\n' +
                '🌎 USD → Alias: incubar.soja.salida\n' +
                '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
                'Se abrirá WhatsApp para confirmar tu apoyo.'
            );
            notifyWhatsApp('Donación a MBL Arg', amountVal);
        });
    }

    // --- ADMIN / KAGE ASSISTANT ---
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminUser = document.getElementById('adminUser');
    const adminPass = document.getElementById('adminPass');
    const adminLock = document.getElementById('adminLock');
    const adminDash = document.getElementById('adminDash');

    if(adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            // Ofuscación para proteger datos sensibles en el frontend (Fase 1)
            const u = btoa(adminUser.value);
            const p = btoa(adminPass.value);
            
            // Credenciales protegidas: Lunatico2705 / Lun@tico2705
            if(u === 'THVuYXRpY28yNzA1' && p === 'THVuQHRpY28yNzA1') {
                adminLock.classList.add('hidden');
                adminDash.classList.remove('hidden');
                alert('Acceso verificado. Bienvenido al Panel Kage.');
            } else {
                alert('Acceso denegado. Las credenciales no coinciden.');
            }
        });
    }

    // --- TOURNAMENT ENGINE PRO (Inspired by 'Mis Torneos') ---
    const tournamentMode = document.getElementById('tournamentMode');
    const tournamentCategory = document.getElementById('tournamentCategory');
    const shuffleBracketBtn = document.getElementById('shuffleBracketBtn');
    const adminBracket = document.getElementById('adminBracket');
    const publicBracket = document.getElementById('publicBracket');
    const winnerName = document.getElementById('winnerName');
    const updateStatsBtn = document.getElementById('updateStatsBtn');
    const signupListAdmin = document.getElementById('signupListAdmin');

    let currentParticipants = ['Lunatico', 'PhantomKing', 'ShadowSlayer', 'NeonBlade', 'CrimsonGhost', 'IronWall', 'NinjaPro', 'Xcalibur'];

    const renderParticipants = () => {
        if(!participantList) return;
        participantList.innerHTML = currentParticipants.map((p, i) => `
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>${p}</span>
                <i class="fas fa-times" style="color:var(--neon-red); cursor:pointer;" onclick="removePlayer(${i})"></i>
            </div>
        `).join('') || '<p style="color:var(--gray); text-align:center;">No hay jugadores cargados.</p>';
    };

    window.removePlayer = (index) => {
        currentParticipants.splice(index, 1);
        renderParticipants();
    };

    if(addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => {
            if(newPlayerAdmin.value.trim()) {
                currentParticipants.push(newPlayerAdmin.value.trim());
                newPlayerAdmin.value = '';
                renderParticipants();
            }
        });
    }

    const renderSignupsAdmin = () => {
        const signupListAdmin = document.getElementById('signupListAdmin');
        if(!signupListAdmin) return;
        const signups = JSON.parse(localStorage.getItem('tournament_signups')) || [];
        
        if(signups.length === 0) {
            signupListAdmin.innerHTML = '<p style="color:var(--gray); text-align:center;">No hay nuevas inscripciones.</p>';
            return;
        }

        signupListAdmin.innerHTML = signups.map((s, i) => `
            <div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.75rem;">
                <span><b style="color:var(--neon-blue);">${s.nickname}</b> (${s.type})</span>
                <span style="color:var(--gray);">${s.rank}</span>
                <i class="fas fa-trash" style="color:rgba(255,0,60,0.5); cursor:pointer;" onclick="removeSignup(${i})"></i>
            </div>
        `).join('');
    };

    window.removeSignup = (index) => {
        const signups = JSON.parse(localStorage.getItem('tournament_signups')) || [];
        signups.splice(index, 1);
        localStorage.setItem('tournament_signups', JSON.stringify(signups));
        renderSignupsAdmin();
    };

    const publishTournamentBtn = document.getElementById('publishTournamentBtn');
    const tournamentNameInput = document.getElementById('tournamentNameInput');
    const tournamentDate = document.getElementById('tournamentDate');
    const tournamentMaxSeats = document.getElementById('tournamentMaxSeats');

    if(publishTournamentBtn) {
        publishTournamentBtn.addEventListener('click', () => {
            const name = tournamentNameInput.value.trim();
            const date = tournamentDate.value;
            const seats = parseInt(tournamentMaxSeats.value);
            const category = tournamentCategory.value;

            if(!name || !date || isNaN(seats)) {
                alert('⚠️ Por favor completa el Nombre, Fecha y Cupos del torneo.');
                return;
            }

            const newTourney = {
                id: 'FT' + Date.now(),
                name: name,
                mode: category,
                prize: 'A definir',
                status: 'Abierta',
                startDate: date,
                maxSeats: seats,
                signedUp: 0
            };

            tournamentDB.freeTournaments.push(newTourney);
            saveTournaments();
            renderFreeTournaments();
            
            tournamentNameInput.value = '';
            alert(`🔥 ¡TORNEO PUBLICADO! "${name}" ya está visible para todos los ninjas.`);
        });
    }

    if(importSignupsBtn) {
        importSignupsBtn.addEventListener('click', () => {
            const signups = JSON.parse(localStorage.getItem('tournament_signups')) || [];
            if(signups.length === 0) {
                alert('No hay inscriptos para cargar.');
                return;
            }
            // Importar nombres a la lista actual de participantes
            currentParticipants = signups.map(s => s.nickname);
            renderParticipants();
            alert(`✅ ${signups.length} ninjas cargados al Motor de Torneos.`);
        });
    }

    // Inicializar vistas admin
    renderParticipants();
    renderSignupsAdmin();

    const generateLeagueHTML = (players) => {
        let html = '<div style="width:100%;"><h4 class="sub-title">Tabla de Posiciones (Liga)</h4>';
        html += '<table style="width:100%; border-collapse: collapse; font-size:0.8rem; text-align:left;">';
        html += '<tr style="border-bottom:1px solid var(--glass-border); color:var(--neon-blue);"><th>Ninja</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>Pts</th></tr>';
        players.forEach(p => {
            html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.05); height:35px;">
                <td>${p}</td><td>0</td><td>0</td><td>0</td><td>0</td><td style="color:var(--naruto-orange); font-weight:700;">0</td>
            </tr>`;
        });
        html += '</table></div>';
        return html;
    };

    const generateBracketHTML = (players, isAdmin = false) => {
        let html = '';
        const stages = players.length > 8 ? ['Octavos', 'Cuartos', 'Semis', 'Final'] : 
                       players.length > 4 ? ['Cuartos', 'Semis', 'Final'] : ['Semis', 'Final'];
        
        stages.forEach((stage, sIdx) => {
            const matchesCount = Math.pow(2, stages.length - sIdx - 1);
            html += `<div class="bracket-column"><div class="bracket-title">${stage}</div>`;
            for(let i=0; i < matchesCount; i++) {
                const p1 = (sIdx === 0) ? (players[i*2] || 'TBD') : 'TBD';
                const p2 = (sIdx === 0) ? (players[i*2+1] || 'TBD') : 'TBD';
                html += `
                    <div class="match-item">
                        <div class="match-player" id="stage${sIdx}-m${i}-p1">${p1}</div>
                        <div class="match-player" id="stage${sIdx}-m${i}-p2">${p2}</div>
                        ${isAdmin ? `
                            <select class="admin-winner-select" onchange="advancePlayerPro(${sIdx}, ${i}, this.value)">
                                <option value="">Ganador...</option>
                                <option value="${p1}">${p1}</option>
                                <option value="${p2}">${p2}</option>
                            </select>
                        ` : ''}
                    </div>`;
            }
            html += '</div>';
        });
        return html;
    };

    if(shuffleBracketBtn) {
        shuffleBracketBtn.addEventListener('click', () => {
            const mode = tournamentMode.value;
            const category = tournamentCategory.value;
            const shuffled = [...currentParticipants].sort(() => Math.random() - 0.5);
            
            if(mode === 'elimination') {
                adminBracket.innerHTML = `<h4 style="color:var(--naruto-orange); margin-bottom:15px; font-size:0.8rem; text-align:center;">Torneo ${category} - Eliminatoria</h4>` + generateBracketHTML(shuffled, true);
                publicBracket.innerHTML = `<h4 style="color:var(--naruto-orange); margin-bottom:15px; text-align:center;">Torneo ${category} - Eliminatoria</h4>` + generateBracketHTML(shuffled, false);
            } else {
                adminBracket.innerHTML = `<h4 style="color:var(--neon-blue); margin-bottom:15px; font-size:0.8rem; text-align:center;">Torneo ${category} - Liga</h4>` + generateLeagueHTML(shuffled);
                publicBracket.innerHTML = `<h4 style="color:var(--neon-blue); margin-bottom:15px; text-align:center;">Torneo ${category} - Liga</h4>` + generateLeagueHTML(shuffled);
            }
            alert(`✅ Fixture de ${category} (${mode === 'league' ? 'Liga' : 'Eliminatoria'}) generado.`);
        });
    }

    // --- GESTIÓN DE HISTORIAL DE PARTIDOS (TIMELINE FIRESTORE COMPATIBLE) ---
    window.registrarPartidoEnHistorial = async (userNickname, partidoData) => {
        const nuevoRegistro = {
            id: 'match_' + Date.now(),
            torneo: partidoData.torneo || 'Torneo Oficial',
            fase: partidoData.fase || 'Fase de Grupos',
            rival: partidoData.rival || 'TBD',
            resultado: partidoData.resultado || 'Victoria', // 'Victoria' o 'Derrota'
            eloCambio: partidoData.eloCambio || (partidoData.resultado === 'Victoria' ? +16 : -16),
            fecha: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        };

        // Fallback a LocalStorage para entorno local
        let historialGlobal = JSON.parse(localStorage.getItem('mbl_historial_partidos')) || {};
        if(!historialGlobal[userNickname]) {
            historialGlobal[userNickname] = [];
        }
        historialGlobal[userNickname].unshift(nuevoRegistro);
        if(historialGlobal[userNickname].length > 20) historialGlobal[userNickname].pop();
        localStorage.setItem('mbl_historial_partidos', JSON.stringify(historialGlobal));

        // Intento de guardado en Firestore si la SDK y db están presentes
        if(typeof db !== 'undefined' && db.collection) {
            try {
                const ninjaRef = db.collection('ninjas').doc(userNickname);
                if(typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) {
                    await ninjaRef.update({
                        historialPartidos: firebase.firestore.FieldValue.arrayUnion(nuevoRegistro)
                    });
                }
            } catch(e) {
                console.log("Modo offline / Local fallback para historial:", e);
            }
        }
    };

    window.advancePlayerPro = (currentStage, matchIndex, winner) => {
        if(!winner || winner === 'TBD') return;
        const nextStage = currentStage + 1;
        const nextMatchIndex = Math.floor(matchIndex / 2);
        const nextSlot = (matchIndex % 2 === 0) ? 'p1' : 'p2';
        
        const targetId = `stage${nextStage}-m${nextMatchIndex}-${nextSlot}`;
        const targetEl = document.getElementById(targetId);
        const publicTargetEl = document.querySelector(`#publicBracket #${targetId}`);

        // Identificar el perdedor del match
        const matchItem = document.getElementById(`stage${currentStage}-m${matchIndex}-p1`) ?
                          document.getElementById(`stage${currentStage}-m${matchIndex}-p1`).parentElement : null;
        let loser = 'TBD';
        if(matchItem) {
            const p1 = document.getElementById(`stage${currentStage}-m${matchIndex}-p1`).innerText;
            const p2 = document.getElementById(`stage${currentStage}-m${matchIndex}-p2`).innerText;
            loser = (winner === p1) ? p2 : p1;
        }

        if(targetEl) {
            targetEl.innerText = winner;
            targetEl.classList.add('winner');
            if(publicTargetEl) {
                publicTargetEl.innerText = winner;
                publicTargetEl.classList.add('winner');
            }

            // Registrar en historial para Ganador y Perdedor
            if(winner !== 'TBD') {
                window.registrarPartidoEnHistorial(winner, { torneo: 'Copa Oficial', fase: `Ronda ${currentStage + 1}`, rival: loser, resultado: 'Victoria', eloCambio: +16 });
            }
            if(loser !== 'TBD') {
                window.registrarPartidoEnHistorial(loser, { torneo: 'Copa Oficial', fase: `Ronda ${currentStage + 1}`, rival: winner, resultado: 'Derrota', eloCambio: -16 });
            }

            // Simular Alerta para el Usuario
            const currentUser = sessionStorage.getItem('currentUser');
            if(currentUser && JSON.parse(currentUser).user === winner) {
                alert(`🎊 ¡FELICITACIONES NINJA! 🎊\nHas ganado tu encuentro y avanzas a la Fase ${nextStage + 1}.\nPreparate para tu próximo combate.`);
            } else {
                alert(`📢 Fase Actualizada: ${winner} avanza a la siguiente ronda.`);
            }

            // Update next stage select
            const nextMatchContainer = targetEl.parentElement;
            const nextSelect = nextMatchContainer.querySelector('select');
            if(nextSelect) {
                const opt = document.createElement('option');
                opt.value = winner;
                opt.text = winner;
                nextSelect.add(opt);
            }
        }
    };

    // --- GESTIÓN DE RESULTADOS (ADMIN) ---
    const updateStatsBtn = document.getElementById('updateStatsBtn');
    const winnerName = document.getElementById('winnerName');

    if(updateStatsBtn) {
        updateStatsBtn.addEventListener('click', () => {
            if(winnerName.value.trim() === '') {
                alert('Ingresá el nombre del ganador para finalizar.');
                return;
            }
            
            // Simulación de actualización de DB y Gráfico
            alert(`🏆 ¡Torneo Finalizado!\nGanador: ${winnerName.value}\n\nActualizando gráficos y base de datos de la temporada...`);
            
            // Actualizar mock data aleatoriamente para simular cambios
            tournamentDB.lastTournament.results = tournamentDB.lastTournament.results.map(r => r + Math.floor(Math.random() * 5));
            
            // Reinicializar gráfico
            const chartStatus = Chart.getChart("resultsChart");
            if (chartStatus != undefined) {
              chartStatus.destroy();
            }
            initResultsChart();
            
            winnerName.value = '';
        });
    }

    // --- SISTEMA DE AUTENTICACIÓN (LOCAL DB) ---
    const authModal = document.getElementById('authModal');
    const btnAuth = document.getElementById('btnAuth');
    const closeAuth = document.getElementById('closeAuth');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Inicializar DB Local si no existe
    if(!localStorage.getItem('mbl_users')) {
        localStorage.setItem('mbl_users', JSON.stringify([]));
    }

    // Manejo de Modal
    if(btnAuth) {
        btnAuth.addEventListener('click', () => authModal.classList.remove('hidden'));
    }
    if(closeAuth) {
        closeAuth.addEventListener('click', () => authModal.classList.add('hidden'));
    }

    // Cambio de Pestañas
    if(loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        });
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        });
    }

    // Lógica de Registro (Local)
    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('mbl_users'));
            const email = document.getElementById('regEmail').value;
            const pass = document.getElementById('regPass').value;
            const user = document.getElementById('regUser').value;

            if(users.find(u => u.email === email)) {
                alert('Este email ya está registrado.');
                return;
            }

            const newUser = {
                id: Date.now(),
                nickname: user,
                email: email,
                pass: btoa(pass), // Ofuscación básica
                tier: 'Genin',
                joinedAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('mbl_users', JSON.stringify(users));
            alert('¡Cuenta creada exitosamente! Ya podés ingresar.');
            loginTab.click();
        });
    }

    // Lógica de Login (Local)
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const users = JSON.parse(localStorage.getItem('mbl_users'));
            const email = document.getElementById('loginEmail').value;
            const pass = btoa(document.getElementById('loginPass').value);

            const userFound = users.find(u => u.email === email && u.pass === pass);

            if(userFound) {
                sessionStorage.setItem('loggedUser', JSON.stringify(userFound));
                alert(`¡Bienvenido de nuevo, ${userFound.nickname}!`);
                authModal.classList.add('hidden');
                updateAuthUI(userFound);
            } else {
                alert('Email o contraseña incorrectos.');
            }
        });
    }

    // --- RENDERIZADO DE PERFIL Y TIMELINE ---
    window.renderPerfilJugador = (userNickname) => {
        const perfilModal = document.getElementById('perfilModal');
        const perfilNombre = document.getElementById('perfilNombre');
        const perfilElo = document.getElementById('perfilElo');
        const historialContainer = document.getElementById('historialPartidosContainer');

        if(!perfilModal) return;

        perfilNombre.innerText = userNickname;

        // Obtener historial del jugador
        const historialGlobal = JSON.parse(localStorage.getItem('mbl_historial_partidos')) || {};
        const historialUser = historialGlobal[userNickname] || [];

        // Calcular ELO simulado
        let eloActual = 1200;
        historialUser.forEach(item => eloActual += item.eloCambio);
        perfilElo.innerText = eloActual;

        if(historialUser.length === 0) {
            historialContainer.innerHTML = `<p style="color: var(--gray); text-align: center; padding: 20px 0; font-size: 0.85rem;">Este ninja aún no ha registrado combates oficiales.</p>`;
        } else {
            historialContainer.innerHTML = historialUser.map(item => {
                const esVic = item.resultado === 'Victoria';
                const colorBadge = esVic ? 'var(--neon-blue)' : 'var(--neon-red)';
                const iconVic = esVic ? 'fa-trophy' : 'fa-skull';
                const eloStr = item.eloCambio > 0 ? `+${item.eloCambio}` : `${item.eloCambio}`;

                return `
                    <div style="background: rgba(0,0,0,0.4); border-left: 3px solid ${colorBadge}; border-radius: 6px; padding: 10px 15px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 0.85rem; font-weight: 700; color: var(--white);">
                                <i class="fas ${iconVic}" style="color: ${colorBadge}; margin-right: 5px;"></i> ${item.torneo} <span style="font-size: 0.7rem; color: var(--gray);">(${item.fase})</span>
                            </div>
                            <div style="font-size: 0.75rem; color: var(--gray); margin-top: 2px;">
                                vs <b>${item.rival}</b> • <span style="color: var(--gray);">${item.fecha}</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 0.8rem; font-weight: 800; color: ${colorBadge}; display: block;">${item.resultado.toUpperCase()}</span>
                            <span style="font-size: 0.7rem; color: ${esVic ? '#53fc18' : 'var(--neon-red)'}; font-family: monospace;">${eloStr} ELO</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        perfilModal.classList.remove('hidden');
    };

    function updateAuthUI(user) {
        if(user) {
            btnAuth.innerHTML = `<i class="fas fa-user-ninja"></i> ${user.nickname}`;
            btnAuth.classList.add('logged-in');

            // Permitir abrir el perfil al hacer click en el botón de usuario
            btnAuth.onclick = (e) => {
                e.preventDefault();
                window.renderPerfilJugador(user.nickname);
            };
        }
    }

    // Función para renderizar lista de usuarios en Admin
    function renderAdminUserList() {
        const userListAdmin = document.getElementById('userListAdmin');
        if(!userListAdmin) return;
        
        const users = JSON.parse(localStorage.getItem('mbl_users')) || [];
        if(users.length === 0) {
            userListAdmin.innerHTML = '<p style="color:var(--gray); text-align:center;">No hay usuarios registrados.</p>';
            return;
        }

        userListAdmin.innerHTML = users.map(u => `
            <div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.8rem;">
                <span style="color:var(--white);">${u.nickname}</span>
                <span style="color:var(--gray);">${u.email}</span>
                <span class="badge ${u.tier.toLowerCase()}" style="font-size:0.6rem;">${u.tier}</span>
            </div>
        `).join('');
    }

    // Actualizar lista cuando el admin loguea
    if(adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            // ... (lógica existente de login admin)
            renderAdminUserList();
        });
    }
    // --- SISTEMA DE SPONSORS & ALIANZAS ---
    const sponsorForm = document.getElementById('sponsorForm');
    if(sponsorForm) {
        sponsorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const brand = document.getElementById('sponsorBrand').value;
            const email = document.getElementById('sponsorEmail').value;
            const budget = document.getElementById('sponsorBudget').value;
            const proposal = document.getElementById('sponsorProposal').value;

            const msg = encodeURIComponent(
                `🤝 NUEVA PROPUESTA DE ALIANZA / SPONSOR\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `🏢 Marca: ${brand}\n` +
                `📧 Contacto: ${email}\n` +
                `💰 Tipo de Inversión: ${budget}\n` +
                `📝 Propuesta: ${proposal}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━\n` +
                `Esperamos tu respuesta para avanzar.`
            );

            alert('✅ Propuesta generada con éxito. Se abrirá WhatsApp para el contacto formal con la administración.');
            window.open(`https://wa.me/541165658881?text=${msg}`, '_blank');
            sponsorForm.reset();
        });
    }
    // --- ASISTENTE KAGE (IA COMMAND CENTER) ---
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiChat = document.getElementById('aiChat');

    const trends = [
        "🔥 Meta MLBB: Los Tanques Jungla dominan el Abismo. Considerá torneos específicos de 'Main Tank'.",
        "🌐 Web Trend: El 'Glassmorphism' (efecto cristal) está en auge. Ya lo estamos usando en tus tarjetas.",
        "🎮 Comunidad: Los torneos 2v2 (Duos) generan un 30% más de engagement en ligas amateurs.",
        "⚡ Diseño: Los efectos de 'Chidori' (truenos) en los marcos mejoran la retención visual.",
        "📊 Monetización: Ofrecer 'Skins' como premio en lugar de dinero atrae a más jugadores Genin."
    ];

    const processAICommand = (text) => {
        const cmd = text.toLowerCase();
        let response = "No estoy seguro de cómo hacer eso todavía, pero puedo aprender.";

        if(cmd.includes('sugerencia') || cmd.includes('tendencia')) {
            response = trends[Math.floor(Math.random() * trends.length)];
        } else if(cmd.includes('rojo') || cmd.includes('fuego')) {
            document.documentElement.style.setProperty('--neon-blue', '#ff003c');
            response = "¡Entendido! He cambiado el flujo de chakra a Rojo Fuego.";
        } else if(cmd.includes('azul') || cmd.includes('rayo')) {
            document.documentElement.style.setProperty('--neon-blue', '#00f0ff');
            response = "He restaurado el Rayo Chidori original (Azul).";
        } else if(cmd.includes('ocultar stream')) {
            document.getElementById('stream').style.display = 'none';
            response = "Sección de Stream ocultada con éxito.";
        } else if(cmd.includes('mostrar stream')) {
            document.getElementById('stream').style.display = 'block';
            response = "Sección de Stream restaurada.";
        } else if(cmd.includes('torneo')) {
            window.location.hash = '#admin';
            response = "Te llevé al Panel de Torneos. ¿Qué quieres crear?";
        }

        return response;
    };

    if(aiSendBtn) {
        aiSendBtn.addEventListener('click', () => {
            const val = aiInput.value.trim();
            if(!val) return;

            // User msg
            aiChat.innerHTML += `<div class="ai-msg user"><i class="fas fa-user"></i> ${val}</div>`;
            
            // AI processing
            setTimeout(() => {
                const response = processAICommand(val);
                aiChat.innerHTML += `<div class="ai-msg bot"><i class="fas fa-robot"></i> ${response}</div>`;
                aiChat.scrollTop = aiChat.scrollHeight;
            }, 500);

            aiInput.value = '';
        });
    }
    // --- SISTEMA DE NINJA CLIPS (OFFTOPIC) ---
    const clipsGrid = document.getElementById('clipsGrid');
    const saveClipBtn = document.getElementById('saveClipBtn');

    let clipsDB = JSON.parse(localStorage.getItem('mbl_ninja_clips')) || [
        { id: 1, author: 'Lunatico', title: 'Maniac con Gusion', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400', comments: ['¡Buena jugada!', 'Tremendo combo.'], likes: 12 },
        { id: 2, author: 'Phantom', title: 'Robo de Lord épico', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400', comments: ['Qué suerte tuviste jaja'], likes: 8 }
    ];

    const renderClips = () => {
        if(!clipsGrid) return;
        clipsGrid.innerHTML = clipsDB.map(clip => `
            <div class="ninja-card chidori-frame" style="padding:0; overflow:hidden;">
                <img src="${clip.url}" style="width:100%; height:200px; object-fit:cover;" onerror="this.src='https://via.placeholder.com/400x200?text=Clip+Video'">
                <div style="padding:15px;">
                    <h4 style="color:var(--neon-blue);">${clip.title}</h4>
                    <p style="font-size:0.7rem; color:var(--gray); margin-bottom:10px;">Subido por: <b>${clip.author}</b></p>
                    
                    <div class="clip-comments" style="max-height:80px; overflow-y:auto; font-size:0.7rem; color:var(--white); background:rgba(0,0,0,0.2); padding:5px; border-radius:5px; margin-bottom:10px;">
                        ${clip.comments.map(c => `<div style="border-bottom:1px solid rgba(255,255,255,0.05); padding:2px;">💬 ${c}</div>`).join('')}
                    </div>

                    <div style="display:flex; gap:5px; margin-bottom:10px;">
                        <input type="text" placeholder="Comentar..." id="comm-input-${clip.id}" style="flex:1; padding:5px; font-size:0.7rem; background:var(--bg-dark); border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:4px;">
                        <button class="btn" style="padding:5px 10px; font-size:0.7rem;" onclick="postComment(${clip.id})"><i class="fas fa-paper-plane"></i></button>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <button class="btn btn-outline" style="font-size:0.7rem; padding:5px 10px;" onclick="contactClipAuthor('${clip.author}')">
                            <i class="fas fa-envelope"></i> Contactar
                        </button>
                        <span style="font-size:0.7rem; color:var(--naruto-orange);"><i class="fas fa-heart"></i> ${clip.likes}</span>
                    </div>
                </div>
            </div>
        `).join('');
    };

    window.postComment = (id) => {
        const input = document.getElementById(`comm-input-${id}`);
        if(!input.value.trim()) return;
        const clipIdx = clipsDB.findIndex(c => c.id === id);
        clipsDB[clipIdx].comments.push(input.value.trim());
        localStorage.setItem('mbl_ninja_clips', JSON.stringify(clipsDB));
        renderClips();
    };

    window.contactClipAuthor = (nickname) => {
        alert(`Iniciando contacto con ${nickname}. Se abrirá WhatsApp para reclutamiento.`);
        const msg = encodeURIComponent(`Hola ${nickname}, vi tu jugada en MBL ARG y me gustaría hablar con vos para una posible incorporación.`);
        window.open(`https://wa.me/541165658881?text=${msg}`, '_blank');
    };

    if(saveClipBtn) {
        saveClipBtn.addEventListener('click', () => {
            const title = document.getElementById('clipTitle').value;
            const url = document.getElementById('clipUrl').value;
            const currentUserData = sessionStorage.getItem('loggedUser');
            const author = currentUserData ? JSON.parse(currentUserData).nickname : 'Anónimo';

            if(!title || !url) {
                alert('Completa los campos para difundir tu jugada.');
                return;
            }

            const newClip = {
                id: Date.now(),
                author: author,
                title: title,
                url: url,
                comments: [],
                likes: 0
            };

            clipsDB.unshift(newClip);
            localStorage.setItem('mbl_ninja_clips', JSON.stringify(clipsDB));
            renderClips();
            document.getElementById('clipUploadModal').classList.add('hidden');
            
            alert('🔥 ¡JUGADA PUBLICADA! Recordá compartir la web en tus comunidades para mantener este espacio de difusión gratis.');
            window.open('https://www.facebook.com/sharer/sharer.php?u=https://mblarg.com.ar', '_blank');
        });
    }

    renderClips();
});

// --- TIKTOK LIVE LOADER (función global) ---
function loadTiktokLive() {
    const urlInput = document.getElementById('tiktokUrl');
    const container = document.getElementById('streamContainer');
    if(!urlInput || !urlInput.value.trim()) {
        alert('Pegá un link de TikTok Live válido.');
        return;
    }
    const url = urlInput.value.trim();
    // TikTok Live embed via iframe
    container.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:15px;">
            <iframe src="${url}" frameborder="0" allowfullscreen style="width:100%;height:85%;border-radius:12px;"></iframe>
            <p style="color:var(--gray);font-size:0.8rem;"><i class="fab fa-tiktok"></i> Retransmitiendo desde TikTok Live</p>
        </div>
    `;
}

// --- SIMULACIÓN DE LLENADO DE CUPOS ---
window.simulateFullQuota = () => {
    // Buscamos el objeto tournamentDB que está dentro del scope de DOMContentLoaded o lo redefinimos para la demo
    // Como está en el scope, lo mejor es emitir un evento o usar una referencia global que ya definimos
    // Para la demo, forzamos la actualización visual del primer torneo
    const event = new CustomEvent('simulateQuota');
    window.dispatchEvent(event);
};
