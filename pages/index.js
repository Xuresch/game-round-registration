import Card from "@/components/shared/card/card";
import styles from "./Home.module.css";

function HomePage() {
  return (
    <Card>
      <h1>Willkommen bei NerdRound – wo Spielefans sich versammeln!</h1>

      <p>
        Du liebst Rollenspiele, tauchst gerne in die faszinierenden Welten von
        Tabletop-Spielen ein oder bist der ungeschlagene Meister im Brettspiel
        deiner Wahl? Dann bist du hier genau richtig! Bei NerdRound kannst du
        Spieleevents für all diese Leidenschaften erstellen und dich mit
        Gleichgesinnten messen.
      </p>

      <h2>Warum du NerdRound lieben wirst:</h2>
      <ul>
        <li>
          <strong>Einfach und sicher:</strong> Kein Passwort, kein Stress! Mit
          unserem passwortlosen Login kommst du blitzschnell zu deinem nächsten
          Spielabenteuer.
        </li>
        <li>
          <strong>Platz gesichert – oder auf der Warteliste:</strong> Unsere
          Registrierung sorgt dafür, dass du deinen Platz im Spiel sicher hast.
          Und sollte einmal alles ausgebucht sein? Kein Problem! Mit unserer
          Warteliste bleibst du im Spiel und rückst nach, sobald ein Platz frei
          wird.
        </li>
        <li>
          <strong>Deine Daten, dein Spiel:</strong> Wir nehmen Datenschutz
          ernst. Außer deinem Nutzernamen und deiner E-Mail speichern wir
          nichts. Versprochen!
        </li>
      </ul>

      <p>
        <strong>Ein kleiner Hinweis:</strong> Wir befinden uns aktuell in der
        Testphase. Sollten also kleine Monster (auch bekannt als "Bugs")
        auftauchen, haben sie sich nur verlaufen. Wir arbeiten ständig daran,
        sie zu fangen und unsere Plattform zu verbessern. Unsere umfassende
        Roadmap ist bereits in Planung, und wir freuen uns über jedes Feedback.
        Schick uns einfach eine Eule, ähm, E-Mail an{" "}
        <a href="mailto:info@nerdround.games">info@nerdround.games</a>.
      </p>
    </Card>
  );
}

export default HomePage;
