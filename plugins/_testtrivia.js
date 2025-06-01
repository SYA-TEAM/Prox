const questions = [
    {
        question: "¿Quién fue el padre de Melquisedec?",
        options: ["Abraham", "Noé", "Ninguno, Melquisedec no tenía padre"],
        answer: "C"
    },
    {
        question: "¿Cuál es el nombre del rey que pidió que se escribieran los Salmos?",
        options: ["David", "Salomón", "Ezequías"],
        answer: "A"
    },
    {
        question: "¿En qué libro de la Biblia se describe la creación del mundo?",
        options: ["Éxodo", "Génesis", "Levítico"],
        answer: "B"
    },
    {
        question: "¿Qué profeta desafió a los profetas de Baal en el monte Carmelo?",
        options: ["Isaías", "Elías", "Jeremías"],
        answer: "B"
    },
    {
        question: "¿Quién desarrolló la teoría de la relatividad?",
        options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein"],
        answer: "C"
    },
    {
        question: "¿Qué planeta es conocido como el 'Planeta Rojo'?",
        options: ["Júpiter", "Marte", "Saturno"],
        answer: "B"
    },
    {
        question: "¿Quién formuló la teoría de la evolución por selección natural?",
        options: ["Charles Darwin", "Jean-Baptiste Lamarck", "Gregor Mendel"],
        answer: "A"
    },
    {
        question: "¿Cuál es la unidad básica de la vida?",
        options: ["El átomo", "La célula", "El órgano"],
        answer: "B"
    },
    {
        question: "¿Quién fue el emperador romano que dividió el Imperio Romano en dos partes?",
        options: ["Constantino I", "Diocleciano", "Teodosio I"],
        answer: "B"
    },
    {
        question: "¿Cuál es el nombre de la primera mujer que ganó un Premio Nobel?",
        options: ["Marie Curie", "Dorothy Hodgkin", "Rosalind Franklin"],
        answer: "A"
    },
    {
        question: "¿Quién pintó la Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci"],
        answer: "C"
    },
    {
        question: "¿Cuál es el animal más grande del mundo?",
        options: ["Elefante", "Ballena azul", "Rinoceronte"],
        answer: "B"
    },
    {
        question: "¿Cuál es la capital de Francia?",
        options: ["Londres", "Roma", "París"],
        answer: "C"
    },
    {
        question: "¿En qué ciudad se encuentra la Torre Eiffel?",
        options: ["Roma", "París", "Londres"],
        answer: "B"
    },
    {
        question: "¿Quién fue el primer hombre en caminar sobre la Luna?",
        options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin"],
        answer: "B"
    },
    {
        question: "¿Cuál es el río más largo del mundo?",
        options: ["Nilo", "Amazonas", "Yangtsé"],
        answer: "A"
    },
    {
        question: "¿Cuál es el símbolo químico del oro?",
        options: ["Ag", "Au", "O"],
        answer: "B"
    },
    {
        question: "¿Qué país inventó la pizza?",
        options: ["Italia", "Francia", "España"],
        answer: "A"
    },
    {
        question: "¿Cuál es la moneda de Japón?",
        options: ["Yuan", "Yen", "Won"],
        answer: "B"
    },
    {
        question: "¿Quién escribió 'Don Quijote de la Mancha'?",
        options: ["Miguel de Cervantes", "Lope de Vega", "Francisco de Quevedo"],
        answer: "A"
    }
];

let triviaSessions = new Map();

const triviaHandler = async (m, { conn, command, args, usedPrefix }) => {
    if (args.length === 0) {
        // Seleccionar pregunta aleatoria
        let randomIndex = Math.floor(Math.random() * questions.length);
        let questionData = questions[randomIndex];

        triviaSessions.set(m.chat, { 
            index: randomIndex, 
            answered: false,
            startTime: Date.now()
        });

        const caption = `🎓 *TRIVIA DE CULTURA GENERAL*

📝 ${questionData.question}

🅰️ ${questionData.options[0]}
🅱️ ${questionData.options[1]}
🅲 ${questionData.options[2]}

⏰ Responde con: *${usedPrefix}trivia A*, *${usedPrefix}trivia B* o *${usedPrefix}trivia C*`;

        // Intentar enviar botones interactivos modernos
        try {
            const interactiveMessage = {
                body: { text: caption },
                footer: { text: "🧠 Desafía tu conocimiento" },
                header: { title: "TRIVIA CHALLENGE", hasSubtitle: false },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: `🅰️ ${questionData.options[0]}`,
                                id: `${usedPrefix}trivia A`
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: `🅱️ ${questionData.options[1]}`,
                                id: `${usedPrefix}trivia B`
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: `🅲 ${questionData.options[2]}`,
                                id: `${usedPrefix}trivia C`
                            })
                        }
                    ]
                }
            };

            await conn.sendMessage(m.chat, { interactiveMessage }, { quoted: m });
        } catch (error) {
            // Fallback: usar botones tradicionales
            const buttons = [
                { buttonId: `${usedPrefix}trivia A`, buttonText: { displayText: `🅰️ ${questionData.options[0]}` }, type: 1 },
                { buttonId: `${usedPrefix}trivia B`, buttonText: { displayText: `🅱️ ${questionData.options[1]}` }, type: 1 },
                { buttonId: `${usedPrefix}trivia C`, buttonText: { displayText: `🅲 ${questionData.options[2]}` }, type: 1 }
            ];

            try {
                await conn.sendMessage(m.chat, {
                    text: caption,
                    footer: "🧠 Desafía tu conocimiento",
                    buttons: buttons,
                    headerType: 1
                }, { quoted: m });
            } catch (error2) {
                // Fallback final: mensaje de texto simple
                await conn.reply(m.chat, caption, m);
            }
        }

    } else {
        // Evaluar respuesta
        let session = triviaSessions.get(m.chat);
        if (!session || session.answered) {
            return conn.reply(m.chat, `⚠️ Primero usa *${usedPrefix}trivia* para obtener una pregunta.`, m);
        }

        let userAnswer = args[0].toUpperCase();
        let correctAnswer = questions[session.index].answer;
        let isCorrect = userAnswer === correctAnswer;
        
        // Calcular tiempo transcurrido
        let timeElapsed = Math.round((Date.now() - session.startTime) / 1000);
        
        let resultEmoji = isCorrect ? "🎉" : "❌";
        let resultText = isCorrect ? "¡RESPUESTA CORRECTA!" : "RESPUESTA INCORRECTA";
        
        const responseCaption = `${resultEmoji} *${resultText}*

📌 Tu respuesta: *${userAnswer}*
✅ Respuesta correcta: *${correctAnswer}*
⏱️ Tiempo: ${timeElapsed} segundos

${isCorrect ? "🌟 ¡Excelente conocimiento!" : "📚 ¡Sigue aprendiendo!"}

🔄 Usa *${usedPrefix}trivia* para una nueva pregunta`;

        // Intentar enviar respuesta con botón
        try {
            const responseMessage = {
                body: { text: responseCaption },
                footer: { text: "¡Desafía tu conocimiento!" },
                header: { title: isCorrect ? "🏆 ¡CORRECTO!" : "📖 INCORRECTO", hasSubtitle: false },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🔄 Nueva Pregunta",
                                id: `${usedPrefix}trivia`
                            })
                        }
                    ]
                }
            };

            await conn.sendMessage(m.chat, { interactiveMessage: responseMessage }, { quoted: m });
        } catch (error) {
            // Fallback: botón tradicional
            const newQuestionButton = [
                { buttonId: `${usedPrefix}trivia`, buttonText: { displayText: "🔄 Nueva Pregunta" }, type: 1 }
            ];

            try {
                await conn.sendMessage(m.chat, {
                    text: responseCaption,
                    footer: "¡Desafía tu conocimiento!",
                    buttons: newQuestionButton,
                    headerType: 1
                }, { quoted: m });
            } catch (error2) {
                // Fallback final: mensaje simple
                await conn.reply(m.chat, responseCaption, m);
            }
        }

        // Marcar como respondida
        triviaSessions.set(m.chat, { ...session, answered: true });
    }
};

triviaHandler.help = ['trivia'];
triviaHandler.tags = ['fun'];
triviaHandler.command = ['trivia'];

export default triviaHandler;
