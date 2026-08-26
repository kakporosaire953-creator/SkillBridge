import { LearningItem, MentorApplication } from '../types/learning';

export const INITIAL_LEARNING_ITEMS: LearningItem[] = [
  // 1. PROGRAMME OFFICIEL SKILLBRIDGE (Formation Certifiante Gratuite)
  {
    id: 'sb-prog-cloud-resilience',
    type: 'formation',
    title: 'Programme Officiel SkillBridge : Ingénierie Cloud & Résilience des Systèmes Panafricains',
    slug: 'programme-officiel-cloud-resilience-panafricaine',
    headline: 'Programme d\'excellence officiel de la Faculté SkillBridge pour concevoir des infrastructures tolérantes aux pannes.',
    description: 'Ce programme officiel structuré vous forme aux standards industriels de la haute disponibilité, de l\'orchestration conteneurisée et de l\'observabilité critique. Délivre un certificat officiel vérifiable SkillBridge après validation des modules et de l\'examen final.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    category: 'Cloud & Infrastructure',
    targetSkills: ['Architecture Cloud', 'Haute Disponibilité', 'Résilience Réseau', 'DevOps & Sécurité'],
    level: 'Tous niveaux',
    language: 'Français',
    estimatedDuration: '18h (6 modules)',
    accessType: 'free',
    isOfficialSkillBridge: true,
    authorType: 'skillbridge',
    isCertifying: true,
    certificationCriteria: {
      minPassingScorePercent: 80,
      requireAllLessons: true,
      requireCapstoneProject: true
    },
    mentorId: 'skillbridge-official-faculty',
    mentorName: 'SkillBridge Official Academy',
    mentorRole: 'Direction Pédagogique & Collège des Architectes',
    mentorCompany: 'SkillBridge Certification Board',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    mentorBio: 'Corps professoral et comité d\'ingénierie officiel de SkillBridge, garant de la rigueur pédagogique et de la valeur souveraine du Skill Passport.',
    prerequisites: [
      'Bases en programmation backend ou DevOps (Linux, conteneurs, réseaux HTTP)',
      'Connaissance générale des architectures client-serveur'
    ],
    includedResources: [
      'Manuel officiel d\'architecture résiliente SkillBridge (PDF)',
      'Accès aux environnements de test et benchmarks réseau',
      'Émission du certificat officiel vérifiable avec empreinte cryptographique'
    ],
    published: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-02-24T10:00:00Z',
    modules: [
      {
        id: 'mod-sb-1',
        title: 'Module 1 : Fondements de la Haute Disponibilité & Tolérance aux Pannes',
        description: 'Principes directeurs des systèmes critiques : isolation de pannes, idempotence et backoff.',
        order: 1,
        lessons: [
          {
            id: 'les-sb-1-1',
            title: '1. Introduction aux standards officiels SkillBridge',
            description: 'Les critères d\'ingénierie et la matrice d\'évaluation des compétences.',
            durationMinutes: 20,
            order: 1,
            isFreePreview: true,
            blocks: [
              {
                id: 'blk-sb-1-1-1',
                type: 'text',
                order: 1,
                content: {
                  markdown: `### Bienvenue dans le Programme Officiel SkillBridge
                  
Ce programme académique et professionnel valide votre capacité à déployer des systèmes informatiques répondant aux contraintes les plus exigeantes d'Afrique et des marchés internationaux.

#### Objectifs clés :
1. **Élimination des points de défaillance uniques (SPOF)**.
2. **Gestion rigoureuse des pannes réseau intermittentes**.
3. **Audit et validation formelle de vos livrables techniques**.`
                }
              },
              {
                id: 'blk-sb-1-1-2',
                type: 'video',
                order: 2,
                content: {
                  videoUrl: 'https://www.youtube-nocookie.com/embed/2eebptXfEvw',
                  title: 'Présentation officielle du Collège des Architectes',
                  durationSeconds: 620
                }
              },
              {
                id: 'blk-sb-1-1-3',
                type: 'document',
                order: 3,
                content: {
                  title: 'Syllabus & Guide de Certification Officiel (PDF)',
                  description: 'Document officiel détaillant les compétences auditées lors de l\'examen final.',
                  fileUrl: 'https://example.com/syllabus-skillbridge-cloud.pdf',
                  fileSize: '1.8 MB',
                  fileType: 'PDF',
                  isDownloadable: true
                }
              }
            ]
          },
          {
            id: 'les-sb-1-2',
            title: '2. Évaluation de Module : Quiz de Conformité Architecturale',
            description: 'Validez votre score pour avancer vers la certification officielle.',
            durationMinutes: 15,
            order: 2,
            blocks: [
              {
                id: 'blk-sb-1-2-1',
                type: 'quiz',
                order: 1,
                content: {
                  title: 'Quiz Officiel : Isolation des Pannes & Idempotence',
                  passingScorePercent: 80,
                  questions: [
                    {
                      id: 'q-sb-1',
                      question: 'Quel est l\'impact principal d\'une conception sans clé d\'idempotence sur une passerelle de paiement ?',
                      options: [
                        { id: 'opt-sb-1', text: 'Risque de doubles débits lors d\'un rejeu automatique suite à un timeout réseau', isCorrect: true },
                        { id: 'opt-sb-2', text: 'Une diminution de la taille des paquets TCP', isCorrect: false },
                        { id: 'opt-sb-3', text: 'Une incompatibilité avec les bases de données SQL', isCorrect: false }
                      ],
                      explanation: 'L\'idempotence garantit qu\'une requête répétée avec la même clé produit le même résultat sans action dupliquée.'
                    },
                    {
                      id: 'q-sb-2',
                      question: 'Quelle stratégie permet d\'éviter l\'engorgement d\'un serveur lors du redémarrage d\'une grappe de services ?',
                      options: [
                        { id: 'opt-sb-4', text: 'Exponential Backoff avec Jitter (délai aléatoire)', isCorrect: true },
                        { id: 'opt-sb-5', text: 'Boucle infinie sans temporisation', isCorrect: false },
                        { id: 'opt-sb-6', text: 'Désactivation immédiate des certificats TLS', isCorrect: false }
                      ],
                      explanation: 'Le jitter évite le phénomène de thundering herd en désynchronisant les tentatives des clients.'
                    }
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        id: 'mod-sb-2',
        title: 'Module 2 : Épreuve Finale de Certification & Projet Pratique',
        description: 'Concevez et soumettez l\'infrastructure résiliente validée par le jury SkillBridge.',
        order: 2,
        lessons: [
          {
            id: 'les-sb-2-1',
            title: '3. Projet Capstone Officiel : Cluster Tolérant aux Pannes',
            description: 'Livrable obligatoire pour l\'obtention du certificat officiel SkillBridge.',
            durationMinutes: 180,
            order: 1,
            blocks: [
              {
                id: 'blk-sb-2-1-1',
                type: 'text',
                order: 1,
                content: {
                  markdown: `### Cahier des Charges de l'Épreuve Finale
                  
Pour débloquer votre **Certificat Officiel SkillBridge**, vous devez réaliser et soumettre :
1. Un dépôt GitHub documenté avec schémas d'architecture.
2. Un microservice avec gestion de file asynchrone et retry résilient.
3. Une suite de tests d'intégration simulant une perte réseau impromptue.`
                }
              },
              {
                id: 'blk-sb-2-1-2',
                type: 'project',
                order: 2,
                content: {
                  title: 'Projet Capstone Officiel : Passerelle Haute Disponibilité',
                  context: 'Cas réel : système de traitement de transactions résistant aux ruptures de câbles sous-marins ou coupures locales.',
                  objectives: [
                    'Mise en place d\'un mécanisme Outbox Pattern audité.',
                    'Garantie de non-duplication des messages.',
                    'Temps de reprise après incident inférieur à 500ms.'
                  ],
                  instructions: 'Déposez l\'URL de votre dépôt GitHub public contenant le code et le dossier de tests.',
                  deliverableType: 'github',
                  evaluationCriteria: [
                    'Structure du code et respect des design patterns de résilience',
                    'Couverture de tests unitaires et d\'intégration > 80%',
                    'Qualité du README et de l\'analyse des pannes simulées'
                  ],
                  targetSkillStage: 'verified'
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // 2. PROGRAMME OFFICIEL SKILLBRIDGE (Formation Certifiante Payante / Bootcamp)
  {
    id: 'sb-prog-fintech-systems',
    type: 'formation',
    title: 'Programme Officiel SkillBridge : Architectures Systèmes Financiers & Sécurité des Transactions',
    slug: 'programme-officiel-systemes-financiers-securite',
    headline: 'Parcours d\'excellence officiel pour ingénieurs bancaires, concepteurs de protocoles financiers et auditeurs système.',
    description: 'Une formation professionnelle approfondie couvrant la cryptographie appliquée, les transactions ACID distribuées, la conformité PCI-DSS et la gestion des registres comptables immuables. Donne lieu à un certificat officiel certifié avec score d\'examen.',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    category: 'Sécurité & FinTech',
    targetSkills: ['Cybersécurité & Conformité', 'Bases de Données & ACID', 'Architecture & Systèmes Distribués', 'Cryptographie'],
    level: 'Avancé',
    language: 'Français',
    estimatedDuration: '28h (Cursus complet)',
    accessType: 'paid',
    price: 95,
    currency: 'EUR',
    isOfficialSkillBridge: true,
    authorType: 'skillbridge',
    isCertifying: true,
    certificationCriteria: {
      minPassingScorePercent: 85,
      requireAllLessons: true,
      requireCapstoneProject: true
    },
    mentorId: 'skillbridge-official-faculty',
    mentorName: 'SkillBridge Official Academy',
    mentorRole: 'Pôle FinTech & Systèmes Critiques',
    mentorCompany: 'SkillBridge Certification Board',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    mentorBio: 'Comité de certification des compétences de pointe dans le domaine bancaire, monétique et transactions distribuées.',
    prerequisites: [
      'Expérience avérée en développement backend (3+ ans)',
      'Maîtrise des protocoles de transport chiffrés et des architectures relationnelles'
    ],
    includedResources: [
      'Pack complet de blueprints réglementaires et sécurité',
      'Simulateur de charge pour tests de stress 10 000 TPS',
      'Audit individuel de code par le Collège des Architectes'
    ],
    published: true,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-25T12:00:00Z',
    modules: [
      {
        id: 'mod-fin-1',
        title: 'Module 1 : Double-Entry Ledger & Consistance Stricte',
        description: 'Conception de livres de comptes infalsifiables et isolation des écritures concurrentes.',
        order: 1,
        lessons: [
          {
            id: 'les-fin-1-1',
            title: '1. Principes de la comptabilité en partie double dans les SGBD modernes',
            description: 'Écrire du code financier sans aucun risque de déséquilibre de bilan.',
            durationMinutes: 40,
            order: 1,
            isFreePreview: true,
            blocks: [
              {
                id: 'blk-fin-1-1-1',
                type: 'text',
                order: 1,
                content: {
                  markdown: `### Règle d'or : La somme des débits égale la somme des crédits
                  
Dans tout système financier critique, aucune ligne comptable n'est modifiée ou supprimée (*Append-Only*).`
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // 3. COURS DES MENTORS : DR. OUSMANE SYLLA
  {
    id: 'lrn-course-1',
    type: 'course',
    title: 'Architecture Systèmes Distribués & Résilience Réseau',
    slug: 'architecture-systemes-distribues',
    headline: 'Concevoir des architectures tolérantes aux pannes adaptées aux réalités des réseaux africains.',
    description: 'Ce cours approfondi vous guide dans la conception de backends distribués résilients, la gestion des consensus, la réplication de données sans perte lors des coupures réseau intermittentes et la haute disponibilité.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    category: 'Systèmes & Cloud',
    targetSkills: ['Architecture & Systèmes Distribués', 'PostgreSQL & Haute Disponibilité', 'Résilience Réseau'],
    level: 'Intermédiaire',
    language: 'Français',
    estimatedDuration: '4h 30m',
    accessType: 'free',
    isOfficialSkillBridge: false,
    authorType: 'mentor',
    isCertifying: true,
    certificationCriteria: {
      minPassingScorePercent: 75,
      requireAllLessons: true,
      requireCapstoneProject: true
    },
    mentorId: 'prof-ousmane-sylla',
    mentorName: 'Dr. Ousmane Sylla',
    mentorRole: 'VP Architecture Systèmes & Infrastructure',
    mentorCompany: 'FinTech Alliance West Africa',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    mentorBio: 'Docteur en informatique distribuée, 15 ans d\'expérience dans le déploiement de backends bancaires et télécoms résilients en Afrique de l\'Ouest.',
    prerequisites: [
      'Bonne maîtrise d\'un langage backend (TypeScript/Node.js, Go, Python ou Java)',
      'Notions de bases de données relationnelles et protocoles HTTP/gRPC'
    ],
    includedResources: [
      'Guide PDF des topologies de consensus en milieu contraint',
      'Boilerplate GitHub de réplication offline-first',
      'Accès direct aux sessions de Q&A avec le mentor'
    ],
    published: true,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-15T14:00:00Z',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1 : Fondements et Topologies Distribuées',
        description: 'Comprendre le théorème CAP appliqué aux réseaux émergents et les architectures événementielles.',
        order: 1,
        lessons: [
          {
            id: 'les-1-1',
            title: '1. Introduction aux systèmes résilients',
            description: 'Les défis spécifiques aux infrastructures distribuées et patterns de découplage.',
            durationMinutes: 25,
            order: 1,
            isFreePreview: true,
            blocks: [
              {
                id: 'blk-1',
                type: 'text',
                order: 1,
                content: {
                  markdown: `### Bienvenue dans le cours d'Architecture Distribuée

Dans ce premier module, nous analysons comment concevoir des logiciels capables de survivre aux pannes d'infrastructure.

#### Les 3 piliers indispensables :
1. **L'idempotence des opérations** : Chaque requête doit pouvoir être rejouée sans effet de bord indésirable.
2. **Le découplage asynchrone** : Utilisation de files de messages durables pour amortir les pics de charge.
3. **La réconciliation d'état automatique** : Résolution des conflits lors du retour en ligne d'un nœud isolé.`
                }
              },
              {
                id: 'blk-2',
                type: 'video',
                order: 2,
                content: {
                  videoUrl: 'https://www.youtube-nocookie.com/embed/2eebptXfEvw',
                  title: 'Vidéo : Principes d\'un système résilient',
                  caption: 'Présentation par le Dr. Ousmane Sylla',
                  durationSeconds: 780
                }
              },
              {
                id: 'blk-3',
                type: 'document',
                order: 3,
                content: {
                  title: 'Fiche Synthèse : Topologies Distribuées Résilientes (PDF)',
                  description: 'Document de référence résumant les patterns Outbox, Saga et Consensus distribué.',
                  fileUrl: 'https://example.com/docs/topologies-distribuees.pdf',
                  fileSize: '2.4 MB',
                  fileType: 'PDF',
                  isDownloadable: true
                }
              }
            ]
          },
          {
            id: 'les-1-2',
            title: '2. Quiz de validation : Patterns & Notions Clés',
            description: 'Vérifiez votre compréhension des principes avant d\'aborder la pratique.',
            durationMinutes: 15,
            order: 2,
            blocks: [
              {
                id: 'blk-4',
                type: 'quiz',
                order: 1,
                content: {
                  title: 'Quiz d\'évaluation : Architectures et Résilience',
                  description: 'Répondez correctement pour valider cette étape et faire progresser votre statut de compétence.',
                  passingScorePercent: 75,
                  questions: [
                    {
                      id: 'q-1',
                      question: 'Pourquoi l\'idempotence est-elle cruciale sur des connexions réseau instables ?',
                      options: [
                        { id: 'opt-1', text: 'Elle évite d\'exécuter plusieurs fois une même transaction si l\'acquittement réseau est perdu.', isCorrect: true },
                        { id: 'opt-2', text: 'Elle accélère la vitesse de la mémoire vive du serveur.', isCorrect: false },
                        { id: 'opt-3', text: 'Elle remplace l\'utilisation des bases de données relationnelles.', isCorrect: false }
                      ],
                      explanation: 'Lorsque le réseau coupe avant que le client ne reçoive le résultat d\'une requête, il la réémet. L\'idempotence garantit qu\'aucun double débit ou double écriture n\'a lieu.'
                    },
                    {
                      id: 'q-2',
                      question: 'Quel pattern architectural permet de garantir la cohérence entre une écriture en base de données et la publication d\'un message d\'événement ?',
                      options: [
                        { id: 'opt-4', text: 'Le Transactional Outbox Pattern', isCorrect: true },
                        { id: 'opt-5', text: 'Le Model View Controller (MVC)', isCorrect: false },
                        { id: 'opt-6', text: 'Le Lazy Loading universel', isCorrect: false }
                      ],
                      explanation: 'Le Transactional Outbox Pattern écrit la modification de données et le message dans la même transaction locale avant de relayer le message au broker.'
                    }
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2 : Projet Pratique et Démonstration de Compétence',
        description: 'Mise en œuvre concrète d\'une passerelle de transaction tolérante aux pannes.',
        order: 2,
        lessons: [
          {
            id: 'les-2-1',
            title: '3. Projet Capstone : Moteur de Réplication Offline-First',
            description: 'Concevez et soumettez votre livrable technique pour valider la compétence au niveau "Démontrée".',
            durationMinutes: 120,
            order: 1,
            blocks: [
              {
                id: 'blk-5',
                type: 'text',
                order: 1,
                content: {
                  markdown: `### Cahier des charges du Projet Capstone

Vous devez développer un microservice ou module qui :
1. Enregistre des ordres de transaction localement lors d'une déconnexion simulée.
2. Déclenche une synchronisation sécurisée dès le rétablissement de la connectivité.
3. Applique des clés d'idempotence UUID v4 et résout les conflits selon la règle de l'horodatage vectoriel (*Vector Clocks* ou *Last-Write-Wins* audité).`
                }
              },
              {
                id: 'blk-6',
                type: 'project',
                order: 2,
                content: {
                  title: 'Projet Capstone : Moteur de Réplication Offline-First',
                  context: 'Cas réel : une application mobile marchande effectue des transactions dans des zones à couverture réseau dégradée.',
                  objectives: [
                    'Mettre en place une file de synchronisation persistante.',
                    'Implémenter la détection de doublons par clé d\'idempotence.',
                    'Fournir une suite de tests automatisés validant la résilience.'
                  ],
                  instructions: 'Déposez le lien vers votre dépôt GitHub public contenant le code source, le README d\'architecture et les instructions de test.',
                  deliverableType: 'github',
                  evaluationCriteria: [
                    'Qualité de la gestion des erreurs et des retries avec backoff exponentiel',
                    'Présence de tests unitaires et d\'intégration',
                    'Clarté de la documentation et du schéma d\'architecture'
                  ],
                  targetSkillStage: 'demonstrated'
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // 4. COURS DES MENTORS : AMINATA DIALLO (Payant)
  {
    id: 'lrn-course-2',
    type: 'course',
    title: 'TypeScript Avancé & Design Systems Réactifs',
    slug: 'typescript-avance-design-systems',
    headline: 'Maîtriser les types avancés, la performance de rendu et l\'accessibilité WCAG AA.',
    description: 'Apprenez à concevoir des bibliothèques de composants robustes et réutilisables avec TypeScript strict, animations fluides respectant prefers-reduced-motion et audit d\'accessibilité complet.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    category: 'Frontend & UI',
    targetSkills: ['TypeScript & Frontend Réactif', 'UI/UX & Design Systems', 'Accessibilité Web'],
    level: 'Avancé',
    language: 'Français',
    estimatedDuration: '5h 15m',
    accessType: 'paid',
    price: 45,
    currency: 'EUR',
    isOfficialSkillBridge: false,
    authorType: 'mentor',
    isCertifying: false,
    mentorId: 'prof-aminata-diallo',
    mentorName: 'Aminata Diallo',
    mentorRole: 'Lead Frontend & Design Systems Architect',
    mentorCompany: 'Sahel Digital Studio',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    mentorBio: 'Pionnière de l\'accessibilité numérique et des interfaces multi-écrans en Afrique francophone.',
    prerequisites: [
      'Expérience confirmée en React et TypeScript de base',
      'Familiarité avec Tailwind CSS'
    ],
    includedResources: [
      'Template Figma / Code Tokenisé synchronisé',
      'Pack de composants accessibles prêts à l\'emploi',
      'Audit checklist d\'accessibilité WCAG 2.2'
    ],
    published: true,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-20T11:00:00Z',
    modules: [
      {
        id: 'mod-ts-1',
        title: 'Module 1 : Systèmes de Types Avancés & Génériques',
        description: 'Conditionals types, Mapped types, Inférence et Template Literal Types.',
        order: 1,
        lessons: [
          {
            id: 'les-ts-1-1',
            title: '1. Typage polymorphique des composants UI',
            description: 'Créer des composants flexibles typés dynamiquement (`as="button" | "a"`).',
            durationMinutes: 30,
            order: 1,
            isFreePreview: true,
            blocks: [
              {
                id: 'blk-ts-1',
                type: 'text',
                order: 1,
                content: {
                  markdown: `### Création de composants polymorphes sûrs en TypeScript

Le polymorphisme permet à un composant (ex: \`Button\`) de s'adapter sémantiquement sans perdre le typage de ses attributs HTML.`
                }
              },
              {
                id: 'blk-ts-2',
                type: 'exercise',
                order: 2,
                content: {
                  title: 'Exercice : Composant Polymorphe Button / Link',
                  instructions: 'Implémentez le type générique `PolymorphicComponentProps<E extends React.ElementType, P>` et testez-le avec un bouton rendu sous forme de balise `<a>`.',
                  starterCode: `type AsProp<C extends React.ElementType> = { as?: C; };\n// Complétez le typage ici`,
                  expectedDeliverable: 'Extrait de code TypeScript avec zéro erreur de typage sur `href` vs `onClick`.'
                }
              }
            ]
          }
        ]
      }
    ]
  },

  // 5. MASTERCLASSES
  {
    id: 'lrn-masterclass-1',
    type: 'masterclass',
    title: 'Scaling FinTech en Afrique : Gérer 10M de Transactions par Jour sans Panne',
    slug: 'masterclass-scaling-fintech-afrique',
    headline: 'Session live interactive sur les retours d\'expérience et architectures critiques du mobile money.',
    description: 'Une masterclass exceptionnelle animée par le Dr. Ousmane Sylla, abordant les secrets techniques pour maintenir un service bancaire opérationnel 99.99% du temps, les pièges du scaling et la gestion de crise.',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    category: 'Systèmes & Cloud',
    targetSkills: ['Architecture & Systèmes Distribués', 'Cybersécurité & Conformité', 'Haute Disponibilité'],
    level: 'Intermédiaire',
    language: 'Français',
    estimatedDuration: '1h 30m',
    accessType: 'free',
    isOfficialSkillBridge: false,
    authorType: 'mentor',
    mentorId: 'prof-ousmane-sylla',
    mentorName: 'Dr. Ousmane Sylla',
    mentorRole: 'VP Architecture Systèmes & Infrastructure',
    mentorCompany: 'FinTech Alliance West Africa',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    masterclassDate: '2026-03-24',
    masterclassTime: '18:00 GMT',
    liveAccessUrl: 'https://meet.skillbridge.africa/room/scaling-fintech-2026',
    maxSeats: 150,
    companionResources: [
      { title: 'Slides de présentation de la Masterclass (PDF)', url: 'https://example.com/slides-fintech.pdf', size: '4.8 MB' },
      { title: 'Checklist Haute Disponibilité Infrastructure (PDF)', url: 'https://example.com/ha-checklist.pdf', size: '1.1 MB' }
    ],
    published: true,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-24T12:00:00Z',
    modules: []
  },
  {
    id: 'lrn-masterclass-2',
    type: 'masterclass',
    title: 'Micro-frontends & Performances Web en Conditions Réseau Dégradées',
    slug: 'masterclass-micro-frontends-performance',
    headline: 'Masterclass passée disponible en replay avec code source et ressources téléchargeables.',
    description: 'Comment découper de grands monolithes frontend en micro-applications légères qui s\'exécutent de façon fluide même sur des smartphones d\'entrée de gamme et connexions 3G.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    category: 'Frontend & UI',
    targetSkills: ['TypeScript & Frontend Réactif', 'Performance & Web Vitals', 'Architecture Frontend'],
    level: 'Avancé',
    language: 'Français',
    estimatedDuration: '1h 15m',
    accessType: 'free',
    isOfficialSkillBridge: false,
    authorType: 'mentor',
    mentorId: 'prof-aminata-diallo',
    mentorName: 'Aminata Diallo',
    mentorRole: 'Lead Frontend & Design Systems Architect',
    mentorCompany: 'Sahel Digital Studio',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    masterclassDate: '2026-02-15',
    masterclassTime: '17:00 GMT',
    replayVideoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    companionResources: [
      { title: 'Dépôt d\'exemple Micro-Frontends (Module Federation)', url: 'https://github.com/skillbridge/microfrontend-demo', size: 'GitHub' },
      { title: 'Support de cours complet (PDF)', url: 'https://example.com/micro-frontends-slides.pdf', size: '3.2 MB' }
    ],
    published: true,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-16T15:00:00Z',
    modules: []
  }
];

export const INITIAL_MENTOR_APPLICATIONS: MentorApplication[] = [
  {
    id: 'app-1',
    userId: 'user-sample-2',
    fullName: 'Mamadou Touré',
    email: 'mamadou.toure@cloudinfra.sn',
    currentRole: 'Lead DevOps & Cloud Engineer',
    organization: 'Sonatel / Orange Cloud',
    expertiseDomains: ['DevOps & CI/CD', 'Kubernetes', 'Cloud AWS/GCP', 'Sécurité'],
    yearsExperience: 8,
    portfolioUrl: 'https://mamadoutoure.dev',
    linkedinUrl: 'https://linkedin.com/in/mamadou-toure-devops',
    motivation: 'Partager mon expérience pratique des déploiements conteneurisés et former les talents aux standards industriels du cloud.',
    proposedTopic: 'Formation pratique Kubernetes & CI/CD automatisée pour applications critiques',
    status: 'approved',
    submittedAt: '2026-02-12T14:30:00Z',
    reviewedAt: '2026-02-14T09:00:00Z',
    adminNotes: 'Profil vérifié et validé par l\'équipe SkillBridge.'
  }
];
