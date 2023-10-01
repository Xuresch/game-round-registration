// emailTemplates/registNewPlayerTemplate.mjml.js

const unregistPlayerTemplate = (data) => `
<mjml>
<mj-body background-color="#eceff1">
  <mj-section background-color="#607d8b">
    <mj-column>
      <mj-text font-size="24px" font-weight="bold" color="#fff">Spielrunden abmeldung!</mj-text>
    </mj-column>
  </mj-section>
  <mj-section>
    <mj-text height="32px"></mj-text>
    <mj-text height="32px" color="rgba(0, 0, 0, 0.6)">
      Hallo ${data.name},
    </mj-text>
    <mj-text ></mj-text>
    <mj-text color="rgba(0, 0, 0, 0.6)">
      Du hast dich von der Spielrunde "${data.roundName}" abgemeldet.
    </mj-text>
  </mj-section>
</mj-body>
</mjml>
`;
export default unregistPlayerTemplate;
