const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmationEmail = async (user, token, ticketNumber) => {
    const mailOptions = {
        from: `${ process.env.EMAIL_ADDRESS }`,
        to: user.email,
        subject: "Confirmation de votre adresse email - Thé Tip Top",
        // text:
        // `Bonjour,\n\n
        // Vous recevez cet email car vous venez de créer un compte sur le site du jeu-concours Thé Tip Top. Cependant, pour nous assurer que vous êtes une personne réelle, nous avons besoin que vous confirmiez votre compte.\n\n
        // Pour ce faire, veuillez cliquer sur le lien suivant: ${process.env.BASE_URL}/confirmation?token=${token}&ticket=${ticketNumber} .\n\n
        // Merci de votre compréhension.\n\n
        // L'équipe Thé Tip Top.
        // `,
        html:
        `<div>
            <p>Bonjour,</p>
            <br/><br/>
            <p>Vous recevez cet email car vous venez de créer un compte sur le site du jeu-concours Thé Tip Top. Cependant, pour nous assurer que vous êtes une personne réelle, nous avons besoin que vous confirmiez votre compte.</p>
            <br/><br/>
            <p>Pour ce faire, veuillez cliquer sur le lien suivant: <a href='${process.env.BASE_URL}/confirmation?token=${token}&ticket=${ticketNumber}'>Activer votre compte</a></p>
            <br/>
            <p>Merci de votre compréhension.</p>
            <br/><br/>
            <p>L'équipe Thé Tip Top.</p>
        </div>
        `,
    };

    return new Promise((resolve) => {
        sgMail
        .send(mailOptions)
        .then(() => {
            console.log(`Confirmation email sent to ${user.email}`)
            resolve(true);
        })
        .catch((error) => {
            console.log(`Confirmation email not sent to ${user.email}. Error => ${error}`)
            resolve(false);
        });
    })
};

const sendWelcomeMail = async (user) => {
    const mailOptions = {
        from: `${ process.env.EMAIL_ADDRESS }`,
        to: user.email,
        subject: "Activation de votre compte - Thé Tip Top",
        text:
        `Bonjour et bienvenue sur le site du jeu-concours Thé Tip Top.\n\n
        Votre compte a été activé avec succès. Dès à présent, et ceci jusqu'au 16 novembre, vous pouvez utiliser les tickets que vous possédez afin de tenter votre chance à la roulette et remporter l'un des lots proposés.\n\n
        N'oubliez pas non plus qu'à l'issue du jeu-concours, soit le 16 novembre, un tirage au sort sera effectué parmi tous les participants  afin de déterminer le gagnant d'un an de thé d'une valeur de 360 €.\n\n
        A bientôt sur le site du jeu-concours Thé Tip Top.\n\n
        L'équipe Thé Tip Top.
        `,
    };

    return new Promise((resolve) => {
        sgMail
        .send(mailOptions)
        .then(() => {
            console.log(`Welcome email sent to ${user.email}`)
            resolve(true);
        })
        .catch((error) => {
            console.log(`Welcome email not sent to ${user.email}. Error => ${error}`)
            resolve(false);
        });
    })
};

const sendContactMail = async (data) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        subject: "Nouvelle soumission du formulaire de contact - Thé Tip Top",
        text:
        `Bonjour,\n\n
        Un utilisateur vient d'utiliser le formulaire de contact. Ci-dessous, les informations:\n\n
        Nom: ${ data.name }\n\n
        Email: ${ data.email }\n\n
        Sujet: ${ data.subject }\n\n
        Message: ${ data.message }\n\n
        `,
    };
    
    return new Promise((resolve) => {
        sgMail
        .send(mailOptions)
        .then(() => {
            console.error("Contact email sent")
            resolve({
                status: 200,
                data: {
                    message: "Un mail de contact a été envoyé.",
                    successful: true,
                },
            });
        })
        .catch((error) => {
            console.log('Contact email not sent ' + error)
            resolve({
                status: 400,
                data: {
                    error: error,
                    message: "Une erreur inattendue est survenue.",
                    successful: false,
                },
            });
        });
    });
};


const sendPasswordEmail = async (email, firstname, password) => {
    const mailOptions = {
        from: `${ process.env.EMAIL_ADDRESS }`,
        to: email,
        subject: "Mot de passe oublié - Thé Tip Top",
        html:
        `<div>
            <p>Bonjour ${firstname},</p>
            <br/><br/>
            <p>Vous recevez cet email car vous avez demandé à réinitialiser votre mot de passe sur le site du jeu-concours Thé Tip Top.</p>
            <br/><br/>
            <p>Nouveau mot de passe :${password}'></p>
            <br/>
            <p>Merci de votre compréhension.</p>
            <br/><br/>
            <p>L'équipe Thé Tip Top.</p>
        </div>
        `,
    };

    return new Promise((resolve) => {
        sgMail
        .send(mailOptions)
        .then(() => {
            console.log(`Confirmation email sent to ${email}`)
            resolve(true);
        })
        .catch((error) => {
            console.log(`Confirmation email not sent to ${email}. Error => ${error}`)
            resolve(false);
        });
    })
};


module.exports = {
    sendConfirmationEmail,
    sendWelcomeMail,
    sendContactMail,
    sendPasswordEmail
};
