export const updatePasswordEmail = (password: string) => ({
  Html: {
    Charset: 'UTF-8',
    Data: `<p>Bonjour</p>
  <p>Votre nouveau mot de passe est :  <strong>${password}</strong> </p> <p>L'équipe support</p>`,
  },
  Text: {
    Charset: 'UTF-8',
    Data: `Bonjour,
         Votre nouveau mot de passe est : ${password}
          
          Equipe de support`,
  },
});
