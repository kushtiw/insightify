async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function timeAgo(iso) {
  const secs = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function topGenre(artists) {
  const counts = {};
  artists.forEach(a => (a.genres || []).forEach(g => { counts[g] = (counts[g] || 0) + 1; }));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? '—';
}

function uniqueGenreCount(artists) {
  return new Set(artists.flatMap(a => a.genres || [])).size;
}

function avgPopularity(tracks) {
  if (!tracks.length) return 0;
  return Math.round(tracks.reduce((s, t) => s + (t.popularity || 0), 0) / tracks.length);
}

function renderTracks(tracks, containerId) {
  const el = document.getElementById(containerId);
  if (!tracks.length) { el.innerHTML = '<p class="empty">No tracks found.</p>'; return; }
  el.innerHTML = tracks.slice(0, 20).map((t, i) => {
    const art = t.album?.images?.[2]?.url || t.album?.images?.[0]?.url || '';
    const artists = (t.artists || []).map(a => a.name).join(', ');
    return `
      <div class="track-row ranked">
        <span class="rank">${i + 1}</span>
        <img class="track-art" src="${esc(art)}" alt="" loading="lazy">
        <div class="track-info">
          <div class="track-name">${esc(t.name)}</div>
          <div class="track-artist">${esc(artists)}</div>
        </div>
        <div class="pop-bar">
          <div class="pop-track"><div class="pop-fill" style="width:${t.popularity}%"></div></div>
          <span class="pop-label">${t.popularity}</span>
        </div>
      </div>`;
  }).join('');
}

function renderArtists(artists, containerId) {
  const el = document.getElementById(containerId);
  if (!artists.length) { el.innerHTML = '<p class="empty">No artists found.</p>'; return; }
  el.innerHTML = artists.slice(0, 10).map((a, i) => {
    const img = a.images?.[1]?.url || a.images?.[0]?.url || '';
    const genre = a.genres?.[0] || '';
    return `
      <div class="artist-card">
        <img class="artist-img" src="${esc(img)}" alt="" loading="lazy">
        <div class="artist-num">#${i + 1}</div>
        <div class="artist-name">${esc(a.name)}</div>
        ${genre ? `<div class="artist-genre">${esc(genre)}</div>` : ''}
      </div>`;
  }).join('');
}

function renderRecent(items) {
  const el = document.getElementById('recent-list');
  if (!items.length) { el.innerHTML = '<p class="empty">No recent plays found.</p>'; return; }
  el.innerHTML = items.slice(0, 20).map(item => {
    const t = item.track;
    const art = t.album?.images?.[2]?.url || t.album?.images?.[0]?.url || '';
    const artists = (t.artists || []).map(a => a.name).join(', ');
    return `
      <div class="track-row recent">
        <img class="track-art" src="${esc(art)}" alt="" loading="lazy">
        <div class="track-info">
          <div class="track-name">${esc(t.name)}</div>
          <div class="track-artist">${esc(artists)}</div>
        </div>
        <span class="recent-time">${timeAgo(item.played_at)}</span>
      </div>`;
  }).join('');
}

async function loadTracks(range) {
  document.getElementById('tracks-list').innerHTML = '<p class="empty">Loading…</p>';
  const tracks = await fetchJSON(`/api/top-tracks?time_range=${range}`);
  renderTracks(tracks, 'tracks-list');
  return tracks;
}

async function loadArtists(range) {
  document.getElementById('artists-grid').innerHTML = '<p class="empty">Loading…</p>';
  const artists = await fetchJSON(`/api/top-artists?time_range=${range}`);
  renderArtists(artists, 'artists-grid');
  return artists;
}

function setupTabs(sectionAttr, loadFn) {
  const section = document.querySelector(`[data-section="${sectionAttr}"]`);
  if (!section) return;
  section.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      section.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadFn(tab.dataset.range);
    });
  });
}

async function init() {
  setupTabs('tracks', loadTracks);
  setupTabs('artists', loadArtists);

  const [user, tracks, artists, recent] = await Promise.all([
    fetchJSON('/api/me'),
    loadTracks('medium_term'),
    loadArtists('medium_term'),
    fetchJSON('/api/recently-played'),
  ]);

  // Profile
  const avatar = user.images?.[0]?.url;
  if (avatar) {
    const img = document.getElementById('user-avatar');
    img.src = avatar;
    img.style.display = 'block';
  }
  document.getElementById('user-name').textContent = user.display_name || user.id;

  // Recently played
  renderRecent(recent);

  // Stats
  document.getElementById('stat-genre').textContent = topGenre(artists) || '—';
  document.getElementById('stat-popularity').textContent = avgPopularity(tracks);
  document.getElementById('stat-genres').textContent = uniqueGenreCount(artists);
  document.getElementById('stat-recent').textContent = recent.length;
}

init().catch(err => console.error('Insightify init error:', err));
