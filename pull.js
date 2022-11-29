let child_process = require('child_process');
let fs = require('fs');


function pull_font(family)
{
    let user_agent = " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36";
    let css_url = `https://fonts.googleapis.com/css2?family=${family}`;
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
    let font_file = family.replace(/\+/g, '-').toLowerCase() + '.woff2';

    // Download the font file
    let wget_font = `wget "${font_url}" -O ${font_file}`;

    child_process.spawnSync(wget_font, {
        stdio: 'inherit',
        shell: true
    });
}

pull_font('Material+Symbols+Outlined');
pull_font('Material+Symbols+Sharp');
pull_font('Material+Symbols+Round');

console.log("OK");

