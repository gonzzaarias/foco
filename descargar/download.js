// Configuración de la descarga de Foco. Al publicar una versión nueva, editá solo este bloque.
const FOCO_RELEASE = {
  version: '1.8.3',
  // Cloudflare Pages no acepta archivos de más de 25 MB, por eso el zip vive en un Release de GitHub.
  baseUrl: 'https://github.com/gonzzaarias/foco-app/releases/download/v1.8.3/',
  app: { file: 'Foco-1.8.3-Windows-x64.zip', size: 160233973, sha256: '594c6adf82ffd237203120ac51d5beb7a7af95ce6aee1d67d2f58dbf56b3a1d4' }
};

(() => {
  const $ = name => document.querySelector(`[data-dl="${name}"]`);
  const mb = bytes => `${Math.round(bytes / 1048576)} MB`;
  const url = file => FOCO_RELEASE.baseUrl.replace(/\/?$/, '/') + encodeURIComponent(file);

  $('version').textContent = `Versión ${FOCO_RELEASE.version}`;
  ['app'].forEach(name => {
    const info = FOCO_RELEASE[name];
    const link = $(name);
    link.href = url(info.file);
    link.setAttribute('download', info.file);
    $(`${name}-size`).textContent = mb(info.size);
    $(`${name}-name`).textContent = info.file;
    const hash = $(`${name}-hash`);
    hash.textContent = info.sha256;
    $(`hash-${name}`).addEventListener('click', event => {
      hash.hidden = !hash.hidden;
      event.currentTarget.textContent = hash.hidden ? 'Ver huella SHA-256' : 'Ocultar huella';
    });
    // Si el archivo todavía no está publicado, avisamos en lugar de mostrar un error 404.
    link.addEventListener('click', async event => {
      // Solo se puede comprobar si el archivo está en el mismo sitio; en GitHub u otro dominio el navegador bloquea la consulta.
      if (location.protocol === 'file:' || new URL(link.href, location.href).origin !== location.origin) return;
      $('error').hidden = true;
      try {
        const response = await fetch(link.href, { method: 'HEAD' });
        if (!response.ok) throw new Error('missing');
      } catch {
        event.preventDefault();
        $('error').hidden = false;
      }
    });
  });

  if (!/Windows/i.test(navigator.userAgent)) $('platform').hidden = false;
})();
