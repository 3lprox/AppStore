document.addEventListener('DOMContentLoaded', () => {
    // 💾 Lista de aplicaciones (simulación de base de datos)
    const apps = [
        { 
            name: "App Meteor", 
            description: "La app del tiempo con el mejor diseño Material 3.", 
            icon: "icons/app1_icon.png", 
            downloadUrl: "apks/app_meteor.apk" 
        },
        { 
            name: "TaskFlow", 
            description: "Organiza tu vida y sé productivo con un estilo minimalista.", 
            icon: "icons/app2_icon.png", 
            downloadUrl: "apks/taskflow.apk" 
        },
        { 
            name: "Galaxia Fotos", 
            description: "El mejor gestor de fotos con backups en la nube.", 
            icon: "icons/app3_icon.png", 
            downloadUrl: "apks/galaxia.apk" 
        },
        // Añade más objetos aquí para tener más apps en tu tienda
    ];

    const appListContainer = document.getElementById('app-list');

    // 🔨 Función para crear un elemento de tarjeta de Material Web
    function createAppCard(app) {
        // Creamos el elemento <md-card>
        const card = document.createElement('md-card');
        card.className = 'app-card';
        card.setAttribute('type', 'elevated'); // Tipo de tarjeta elevada (con sombra)

        // Contenido interno (usa innerHTML para la estructura, es más limpio aquí)
        card.innerHTML = `
            <div class="card-content">
                <img src="${app.icon}" alt="Icono de ${app.name}" class="app-icon">
                <div class="app-info">
                    <h2>${app.name}</h2>
                    <p class="description">${app.description}</p>
                </div>
                <md-filled-button class="download-button" href="${app.downloadUrl}" target="_blank">
                    Descargar APK
                    <md-icon slot="icon">download</md-icon>
                </md-filled-button>
            </div>
        `;
        
        return card;
    }

    // ➡️ Renderizar las aplicaciones en la página
    apps.forEach(app => {
        const cardElement = createAppCard(app);
        appListContainer.appendChild(cardElement);
    });

    console.log(`Tienda de APKs lista con ${apps.length} aplicaciones.`);
});
