const stylesArray = [
    'themeFlag',

    'textColor',
    'textColorSecondary',

    'backgroundColor',
    'backgroundColorSecondary',
    'backgroundInput',
    'backgroundButtonColor',
];
type TColorMode = 'Light' | 'Dark';

const bodyStyles = window.getComputedStyle(document.body);

export default function changeColorMode(modeName: TColorMode) {
    const reverseModeName = modeName === 'Dark' ? 'Light' : 'Dark';

    stylesArray.forEach(styleName => {
        document.documentElement.style.setProperty(
            `--${styleName}Reverse`,
            bodyStyles.getPropertyValue(`--${styleName}${reverseModeName}Mode`)
        );

        document.documentElement.style.setProperty(
            `--${styleName}`,
            bodyStyles.getPropertyValue(`--${styleName}${modeName}Mode`)
        );
    });
}
