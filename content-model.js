(function (window) {
    const languages = ['uk', 'ru', 'en', 'cz'];
    const languageLabels = { uk: 'UA', ru: 'RU', en: 'EN', cz: 'CZ' };
    const fields = [
        ['aboutNav', 'Navigation: About'], ['portfolioNav', 'Navigation: Portfolio'], ['servicesNav', 'Navigation: Services'], ['contactNav', 'Navigation: Contact'],
        ['heroEyebrow', 'Hero eyebrow'], ['hero1', 'Hero title line 1'], ['hero2', 'Hero title line 2'], ['heroText', 'Hero description'], ['heroButton', 'Hero CTA'],
        ['aboutEyebrow', 'About label'], ['aboutTitle1', 'About title line 1'], ['aboutTitle2', 'About title line 2'], ['aboutText1', 'About paragraph 1'], ['aboutText2', 'About paragraph 2'], ['aboutText3', 'About paragraph 3'],
        ['portfolioEyebrow', 'Portfolio label'], ['portfolioTitle1', 'Portfolio title line 1'], ['portfolioTitle2', 'Portfolio title line 2'],
        ['servicesEyebrow', 'Services label'], ['servicesTitle1', 'Services title line 1'], ['servicesTitle2', 'Services title line 2'],
        ['contactEyebrow', 'Contact label'], ['contactTitle1', 'Contact title line 1'], ['contactTitle2', 'Contact title line 2'], ['contactText', 'Contact description'],
        ['nameLabel', 'Form name label'], ['phoneLabel', 'Form phone label'], ['emailLabel', 'Form email label'], ['messageLabel', 'Form message label'], ['submit', 'Form submit button'],
        ['footer', 'Footer copyright'], ['instagramNelli', 'Nelli Instagram label'], ['supportLabel', 'Technical support label'], ['supportButton', 'Support link label'],
        ['name', 'Name placeholder'], ['phone', 'Phone placeholder'], ['email', 'Email placeholder'], ['message', 'Message placeholder'],
        ['validationName', 'Name validation'], ['validationPhone', 'Phone validation'], ['validationEmail', 'Email validation'], ['sending', 'Form loading message'], ['sent', 'Form success message'], ['sendError', 'Form error message']
    ];

    function emptyTranslations() {
        return languages.reduce(function (result, lang) {
            result[lang] = {};
            return result;
        }, {});
    }

    function emptyService(id, number) {
        return {
            id: id,
            number: number,
            order: Number(number),
            visible: true,
            translations: emptyTranslations()
        };
    }

    function emptyContent() {
        return {
            version: 1,
            published: false,
            translations: emptyTranslations(),
            media: { heroUrl: '', aboutUrl: '' },
            links: { hero: '#contact' },
            seo: { title: '', description: '', ogTitle: '', ogDescription: '', ogImage: '', favicon: '' },
            sections: { about: true, portfolio: true, services: true, contact: true },
            social: [
                { id: 'nelli', url: 'https://www.instagram.com/nelli_photo_prague/', labelKey: 'instagramNelli', visible: true, order: 1 },
                { id: 'support', url: 'https://www.instagram.com/paparazzi_praha/', labelKey: 'supportLabel', visible: true, order: 2 }
            ],
            services: [emptyService('portrait', '01'), emptyService('love', '02'), emptyService('wedding', '03')],
            portfolio: []
        };
    }

    function mergeContent(value) {
        const base = emptyContent();
        if (!value || typeof value !== 'object') return base;
        const result = Object.assign(base, value);
        result.translations = Object.assign(emptyTranslations(), value.translations || {});
        languages.forEach(function (lang) {
            result.translations[lang] = Object.assign({}, value.translations && value.translations[lang]);
        });
        result.media = Object.assign(base.media, value.media || {});
        result.links = Object.assign(base.links, value.links || {});
        result.seo = Object.assign(base.seo, value.seo || {});
        result.sections = Object.assign(base.sections, value.sections || {});
        result.social = Array.isArray(value.social) ? value.social : base.social;
        result.services = Array.isArray(value.services) && value.services.length ? value.services : base.services;
        result.portfolio = Array.isArray(value.portfolio) ? value.portfolio : [];
        return result;
    }

    window.NelliContentModel = {
        languages: languages,
        languageLabels: languageLabels,
        fields: fields,
        emptyContent: emptyContent,
        mergeContent: mergeContent
    };
}(window));
