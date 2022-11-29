let child_process = require('child_process');
let fs = require('fs');

function pull_font(family)
{
    let basename = family.replace(/\+/g, '-').toLowerCase();
    let displayName = family.replace(/\+/g, ' ');
    let stylename = basename.replace('material-symbols-', '');
    for (let weight = 100; weight <= 700; weight += 100)
    {
        console.log(basename, '@', weight);

        let user_agent = " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36";
        let css_url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`;
        let wget_css = `wget --user-agent="${user_agent}" ${css_url} -O temp.css`;

        // Get the
        child_process.spawnSync(wget_css, {
            stdio: 'inherit',
            shell: true
        });

        // Read the file
        let css = fs.readFileSync('temp.css', 'utf8');

        // Delete temp
        fs.unlinkSync('temp.css');
        
        // Find the URL of the font file
        let m = css.match(/url\((.*?)\)/);
        let font_url = m[1];
        let font_file = `${basename}-${weight}.woff2`;

        // Download the font file
        let wget_font = `wget "${font_url}" -O ${font_file}`;
        
        child_process.spawnSync(wget_font, {
            stdio: 'inherit',
            shell: true
        });

        // Save patched css
        let css2 = 
`@font-face {
    font-family: '${displayName}';
    font-style: normal;
    font-weight: ${weight};
    src: url('${font_file}') format('woff2');
}

.material-symbols-outlined {
    font-family: '${displayName}';
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
    transform: translate(0, .15em);
}

`
        fs.writeFileSync(`${stylename}-${weight}.css`, css2);
    }
}

pull_font('Material+Symbols+Outlined');
pull_font('Material+Symbols+Sharp');
pull_font('Material+Symbols+Round');

console.log("OK");

