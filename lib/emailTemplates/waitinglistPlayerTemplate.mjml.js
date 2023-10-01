// emailTemplates/waitinglistPlayerTemplate.mjml.js

const waitinglistPlayerTemplate = (data) => `
<mjml>
<mj-body background-color="#eceff1">
  <mj-section background-color="#607d8b">
    <mj-column>
      <mj-text font-size="24px" font-weight="bold" color="#fff">Registrierung in Warteliste!</mj-text>
    </mj-column>
  </mj-section>
  <mj-section>
    <mj-text height="32px"></mj-text>
    <mj-text height="32px" color="rgba(0, 0, 0, 0.6)">
      Hallo ${data.name},
    </mj-text>
    <mj-text ></mj-text>
    <mj-text color="rgba(0, 0, 0, 0.6)">
      Du wurdest zur Warteliste für die Spielrunde "${data.roundName}" hinzugefügt.
    </mj-text>
    <mj-text color="rgba(0, 0, 0, 0.6)">
      Du wirst umgehend benachrichtet wenn ein Platz für dich zur verfügung steht.
    </mj-text>
    <mj-text color="rgba(0, 0, 0, 0.6)">
      Klick <a href="${data.roundUrl}" style="color: #ffc107; text-decoration: none;">hier</a> um zu der Spielrunde zu kommen.
    </mj-text>
  </mj-section>
</mj-body>
</mjml>
`;
export default waitinglistPlayerTemplate;
