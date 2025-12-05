import { Component } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {

  // Partie 1 : Les Arguments (Pourquoi ?)
  reasons = [
    {
      icon: '🕵️‍♂️',
      title: 'Confidentialité',
      desc: 'Les GAFAM basent leur richesse sur la vente de votre vie privée. L\'Open Source et le logiciel libre vous protègent : pas de trackers cachés, pas de profilage publicitaire.'
    },
    {
      icon: '🛡️',
      title: 'Sécurité & Transparence',
      desc: 'Le code est public ("Open Source"). Des milliers d\'experts peuvent vérifier qu\'il n\'y a pas de faille ou de porte dérobée. C\'est la sécurité par la transparence.'
    },
    {
      icon: '🔓',
      title: 'Indépendance',
      desc: 'Évitez le "Vendor Lock-in". Avec les formats ouverts, vous n\'êtes pas prisonnier d\'une seule marque (Apple, Microsoft, Google). Vous restez libre de changer.'
    },
    {
      icon: '🌱',
      title: 'Durabilité',
      desc: 'Les logiciels libres tournent souvent mieux sur des vieux ordinateurs, luttant ainsi contre l\'obsolescence programmée et le gaspillage électronique.'
    }
  ];

  // Partie 2 : Les Alternatives (Comment ?)
  tools = [
    {
      category: 'Navigateur Web',
      bad: 'Google Chrome',
      good: 'Firefox / Brave',
      desc: 'Bloquez les pisteurs par défaut.',
      link: 'https://www.mozilla.org/firefox/'
    },
    {
      category: 'Moteur de Recherche',
      bad: 'Google Search',
      good: 'DuckDuckGo',
      desc: 'Des résultats neutres, sans historique traqué.',
      link: 'https://duckduckgo.com/'
    },
    {
      category: 'Messagerie',
      bad: 'WhatsApp / Messenger',
      good: 'Signal',
      desc: 'Chiffrement réel. Vos métadonnées sont protégées.',
      link: 'https://signal.org/'
    },
    {
      category: 'Système d\'exploitation',
      bad: 'Windows / macOS',
      good: 'Linux',
      desc: 'Reprenez le contrôle total de votre machine.',
      link: 'https://www.debian.org/'
    },
    {
      category: 'Cloud / Drive',
      bad: 'Google Drive / iCloud',
      good: 'Proton',
      desc: 'Vos fichiers vous appartiennent vraiment.',
      link: 'https://proton.me/drive'
    }
  ];
}