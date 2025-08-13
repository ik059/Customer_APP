import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import VueCarousel from '@chenfengyuan/vue-carousel';
import { createI18n } from 'vue-i18n'

if (process.env.NODE_ENV === 'production') {
  const noop = () => {};
  const emptyConsole = new Proxy(console, {
    get: (target, prop) => (typeof target[prop] === 'function' ? noop : target[prop]),
  });

  // Override console.warn to suppress specific warnings
  const originalConsoleWarn = console.warn;
  console.warn = function () {
    try {
      // Call the original console.warn to see if it throws the warning
      originalConsoleWarn.apply(console, arguments);
    } catch (warning) {
      // Suppress the specific warning
      if (!warning.message.includes("The specified value must be a finite number")) {
        throw warning;  // Re-throw other warnings
      }
    }
  };

  // Assign the overridden console object
  window.console = emptyConsole;
}
const i18n = createI18n({
  locale: 'de',
  messages: {
    de: {
      login: "Einloggen",
      password: "Passwort",
      emailId: "Email",
      noAccout: "Sie haben kein Konto?",
      signUp: "Anmeldung",
      forgotPassword: "Passwort vergessen?",
      click: 'Klicke hier',
      fName: 'Vorname',
      register: 'Registrieren',
      acountExist: 'Sie haben bereits ein Konto?',
      here: 'Hier',
      machines: 'Maschinen',
      Welcome: 'Herzlich Willkommen',
      location: 'Ort',
      license: 'Kennzeichen',
      registered: 'Eingetragen',
      appointment: 'Termine Buchen',
      time: 'Zeit',
      certificate: 'Zertifikate',
      question: 'Bitte zögern Sie nicht, uns direkt zu kontaktieren. Unser Team wird sich innerhalb weniger Stunden bei Ihnen melden, um Ihnen zu helfen.',
      mailus: 'oder, senden Sie uns Ihre Fragen per E-Mail',
      subject: 'Thema',
      message: 'Ihre Nachricht',
      send: 'Senden',
      messageSent: 'Ihre Nachricht wurde an unser Team gesendet. Wir werden uns so schnell wie möglich bei Ihnen melden',
      querySent: 'Anfrage gesendet',
      close: 'Schließen',
      machine: 'Maschine',
      licenseNumber: 'Amtliches Kennzeichen',
      addLicense: 'Kennzeichen hinzufügen',
      profile: 'Profil',
      profileSection: 'Profil',
      customerID: 'Kundennummer',
      editProfile: 'Profil bearbeiten',
      updatePassword: 'Kennwort aktualisieren',
      fullName: 'Vollständiger Name',
      mobile: 'Handy Nummer',
      address: 'Adresse',
      sure: 'Bist du dir sicher?',
      licenseDelete: 'Kennzeichen wird dauerhaft gelöscht!',
      delete: 'Löschen',
      customersLastname: 'Nachname des Kunden',
      deleteLicense: 'Kennzeichen löschen',
      tableView: 'Tabellenansicht',
      mapView: 'Kartenansicht',
      machineName: 'Maschinenname',
      machineID: 'Maschinen ID',
      here: 'Sie sind hier!',
      bookAppointment: 'Termin buchen',
      confirmBooking: 'Buchung bestätigen?',
      confirm: 'Bestätigt',
      selectMachine: 'Maschine auswählen',
      shiftChose: 'Bitte wählen Sie eine Schicht aus',
      earlyMorning: 'Früher Morgen',
      morning: 'Morgen',
      evening: 'Abend',
      lateEvening: 'Später Abend',
      freeSlots: 'Für dieses Datum stehen folgende Zeitfenster zur Verfügung',
      newAppointmentbook: 'Neuer Termin gebucht!',
      deleteAppointmentAlert: 'Termin wird dauerhaft gelöscht!',
      bookedAppointments: 'Gebuchte Termine',
      belongsTo: 'Gehört',
      customerNumber: 'Kundennummer',
      issuedAt: 'Ausgestellt bei',
      downloadPdf: 'PDF Herunterladen',
      thankYou: 'Danke',
      verified: "Ihr Konto ist jetzt verifiziert!",
      continueLogin: 'Bitte melden Sie sich an, um fortzufahren.',
      wentWrong: 'Etwas ist schiefgelaufen!',
      problem: 'Während der Anmeldung ist ein Problem aufgetreten.',
      tryAgain: 'Please try again!',
      updateYourPassword: 'Aktualisieren Sie Ihr Passwort',
      oldPassword: 'Altes Passwort',
      newPassword: 'Neues Kennwort',
      retypePassword: 'Geben Sie das neue Passwort erneut ein',
      updatePassword: 'Kennwort aktualisieren',
      passwordUpdated: 'Passwort aktualisiert!',
      linkSent: 'Ein Link, der an Ihre E-Mail-Adresse gesendet wird!',
      checkEmailPassword: 'Bitte überprüfen Sie Ihre E-Mail, um das Passwort zu aktualisieren.',
      customer: 'Kunde',
      personalDetails: 'Persönliche Daten',
      lastName: 'Nachname',
      phone: 'Telefon',
      street: 'Straße',
      city: 'Stadt',
      postCode: 'Postleitzahl',
      cancel: 'Stornieren',
      update: 'Aktualisieren',
      contactUs: 'Aktualisieren',
      contactForm: 'Kontakt Formular',
      noGermanLicense: 'Keine deutsche Kennzeichen',
      trailerDesignation: 'Trailer Bezeichnung',
      constractedYear: 'Baujahr',
      furtherInformation: 'Zusatzinformationen',
      model: 'Modell',
      linkExpired: 'Entschuldigung! Der Link ist abgelaufen!',
      registeredSuccessful: 'Erfolgreich registriert!',
      verifyEmailsent: 'Es wurde eine E-Mail an Ihre E-Mail-Adresse gesendet, um Ihre E-Mail-Adresse zu bestätigen!',
      noLicense: 'Sie haben noch keine Kennzeichen hinzugefügt. Neu hinzugefügte Kennzeichen werden hier angezeigt!',
      noCertificate: 'Derzeit haben Sie keine Zertifikate. Wenn ein neues Zertifikat für Sie ausgestellt wird, dann wird es automatisch angezeigt!',
      upcomingAppointments: 'Kommende Termine',
      billingAddress: 'Rechnungsadresse'

    }
  }
})

import fVueGoogleMaps from '@fawmi/vue-google-maps'


/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faCity,
  faEnvelope,
  faIdCard,
  faKey,
  faLocationDot,
  faLock,
  faMobileScreen,
  faRoad,
  faSignature,
  faUser,
  faUserSecret,
  faCheck,
  faUserCircle,
  faFrown,
  faRobot,
  faCalendarCheck,
  faCertificate,
  faDoorOpen,
  faTable,
  faEdit,
  faTrash,
  faPenToSquare,
  faX,
  faPhone,
  faCalendar,
  faQuestion,
  faXmark,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

/* add icons to the library */
library.add(
  faUserSecret,
  faLinkedin,
  faInstagram,
  faFacebook,
  faUser,
  faEnvelope,
  faLock,
  faKey,
  faSignature,
  faMobileScreen,
  faSignature,
  faIdCard,
  faRoad,
  faCity,
  faLocationDot,
  faCheck,
  faUserCircle,
  faFrown,
  faRobot,
  faIdCard,
  faCalendarCheck,
  faCertificate,
  faDoorOpen,
  faTable,
  faPenToSquare,
  faTrash,
  faCheck,
  faX,
  faLocationDot,
  faPhone,
  faCalendar,
  faQuestion,
  faXmark,
  faClock
);
if (process.env.NODE_ENV === 'production') {
    const noop = () => {};
  const emptyConsole = new Proxy(console, {
    get: (target, prop) => (typeof target[prop] === 'function' ? noop : target[prop]),
  });

  // Assign the overridden console object
  window.console = emptyConsole;
}
createApp(App)
  .use(router).use(i18n).use(fVueGoogleMaps, {
    load: {
      key: "AIzaSyCy-407Yrt-tBtL_bVZZtpHJVJFnnQZuRY",
      libraries: "places"
    },
  
  })


  .component("font-awesome-icon", FontAwesomeIcon, VueCarousel)
  .mount("#app");



