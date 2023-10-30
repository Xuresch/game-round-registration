// emailTemplates/registNewPlayerGmTemplate.mjml.js

const registNewPlayerGmTemplate = (data) => `
<mjml>
<mj-body background-color="#eceff1">
  <mj-section background-color="#607d8b">
    <mj-column>
      <mj-text font-size="24px" font-weight="bold" color="#fff">Spielrunden Registrierung!</mj-text>
    </mj-column>
  </mj-section>
  <mj-section>
    <mj-text height="32px"></mj-text>
    <mj-text height="32px" color="rgba(0, 0, 0, 0.6)">
      Hallo ${data.name},
    </mj-text>
    <mj-text ></mj-text>
    <mj-text color="rgba(0, 0, 0, 0.6)">
      Ein neuer Spieler ${data.playerName} hat sich bei deiner Spielrunde "${data.roundName}" registriert.
    </mj-text>
    <mj-text color="rgba(0, 0, 0, 0.6)">
      Klick <a href="${data.roundUrl}" style="color: #ffc107; text-decoration: none;">hier</a> um zu der Spielrunde zu kommen.
    </mj-text>
  </mj-section>
</mj-body>
</mjml>
`;
export default registNewPlayerGmTemplate;