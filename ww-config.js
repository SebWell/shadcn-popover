export default {
  editor: {
    label: {
      en: 'Popover',
      fr: 'Pop-over'
    },
    icon: 'popup',
    customStylePropertiesOrder: [
      'backgroundColor',
      'borderColor',
      'borderRadius',
      'borderWidth'
    ],
    customSettingsPropertiesOrder: [
      'triggerText',
      'title',
      'description',
      'placement',
      'trigger',
      'size',
      'offset',
      'showArrow',
      'showCloseButton',
      'showFooter',
      'disabled',
      'hoverDelay'
    ]
  },
  properties: {
    triggerText: {
      label: {
        en: 'Trigger text',
        fr: 'Texte du déclencheur'
      },
      type: 'Text',
      defaultValue: 'Open Popover',
      bindable: true,
      multiLang: true,
      section: 'settings'
    },
    title: {
      label: {
        en: 'Title',
        fr: 'Titre'
      },
      type: 'Text',
      bindable: true,
      multiLang: true,
      section: 'settings'
    },
    description: {
      label: {
        en: 'Description',
        fr: 'Description'
      },
      type: 'Text',
      bindable: true,
      multiLang: true,
      section: 'settings'
    },
    placement: {
      label: {
        en: 'Placement',
        fr: 'Placement'
      },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'top', label: { en: 'Top', fr: 'Haut' } },
          { value: 'bottom', label: { en: 'Bottom', fr: 'Bas' } },
          { value: 'left', label: { en: 'Left', fr: 'Gauche' } },
          { value: 'right', label: { en: 'Right', fr: 'Droite' } }
        ]
      },
      defaultValue: 'bottom',
      bindable: true,
      section: 'settings'
    },
    trigger: {
      label: {
        en: 'Trigger',
        fr: 'Déclencheur'
      },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'click', label: { en: 'Click', fr: 'Clic' } },
          { value: 'hover', label: { en: 'Hover', fr: 'Survol' } }
        ]
      },
      defaultValue: 'click',
      bindable: true,
      section: 'settings'
    },
    size: {
      label: {
        en: 'Size',
        fr: 'Taille'
      },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'sm', label: { en: 'Small', fr: 'Petit' } },
          { value: 'default', label: { en: 'Default', fr: 'Par défaut' } },
          { value: 'lg', label: { en: 'Large', fr: 'Grand' } },
          { value: 'xl', label: { en: 'Extra Large', fr: 'Très grand' } }
        ]
      },
      defaultValue: 'default',
      bindable: true,
      section: 'settings'
    },
    offset: {
      label: {
        en: 'Offset (px)',
        fr: 'Décalage (px)'
      },
      type: 'Number',
      defaultValue: 8,
      bindable: true,
      section: 'settings'
    },
    showArrow: {
      label: {
        en: 'Show arrow',
        fr: 'Afficher la flèche'
      },
      type: 'OnOff',
      defaultValue: true,
      bindable: true,
      section: 'settings'
    },
    showCloseButton: {
      label: {
        en: 'Show close button',
        fr: 'Afficher le bouton fermer'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'settings'
    },
    showFooter: {
      label: {
        en: 'Show footer',
        fr: 'Afficher le pied de page'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'settings'
    },
    disabled: {
      label: {
        en: 'Disabled',
        fr: 'Désactivé'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'settings'
    },
    hoverDelay: {
      label: {
        en: 'Hover delay (ms)',
        fr: 'Délai de survol (ms)'
      },
      type: 'Number',
      defaultValue: 150,
      bindable: true,
      section: 'settings',
      hidden: content => content.trigger !== 'hover'
    },
    body: {
      label: {
        en: 'Content',
        fr: 'Contenu'
      },
      type: 'Element',
      section: 'content'
    },
    footer: {
      label: {
        en: 'Footer content',
        fr: 'Contenu du pied de page'
      },
      type: 'Element',
      section: 'content',
      hidden: content => !content.showFooter
    },
    triggerClass: {
      label: {
        en: 'Trigger CSS class',
        fr: 'Classe CSS du déclencheur'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    contentClass: {
      label: {
        en: 'Content CSS class',
        fr: 'Classe CSS du contenu'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    titleClass: {
      label: {
        en: 'Title CSS class',
        fr: 'Classe CSS du titre'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    descriptionClass: {
      label: {
        en: 'Description CSS class',
        fr: 'Classe CSS de la description'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    bodyClass: {
      label: {
        en: 'Body CSS class',
        fr: 'Classe CSS du corps'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    },
    footerClass: {
      label: {
        en: 'Footer CSS class',
        fr: 'Classe CSS du pied de page'
      },
      type: 'Text',
      bindable: true,
      section: 'style'
    }
  },
  actions: [
    {
      label: {
        en: 'Open popover',
        fr: 'Ouvrir le pop-over'
      },
      action: 'open'
    },
    {
      label: {
        en: 'Close popover',
        fr: 'Fermer le pop-over'
      },
      action: 'close'
    },
    {
      label: {
        en: 'Toggle popover',
        fr: 'Basculer le pop-over'
      },
      action: 'toggle'
    }
  ],
  triggerEvents: [
    {
      name: 'open',
      label: {
        en: 'On open',
        fr: 'À l\'ouverture'
      }
    },
    {
      name: 'close',
      label: {
        en: 'On close',
        fr: 'À la fermeture'
      }
    }
  ]
} 