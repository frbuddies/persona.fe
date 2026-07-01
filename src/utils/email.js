import { pct } from './scoring';

export function buildEmailHTML({ sortedP, maxP, pri, sortedR, maxR, priRole, S }) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const pBarRows = sortedP.map((prof) => {
    const isPri = prof.id === pri.id;
    const p2 = pct(prof, maxP);
    const barColor = isPri ? prof.accent : '#b0bdd4';
    return `<tr>
      <td style="padding:4px 10px 4px 0;font-size:13px;white-space:nowrap;width:26px;text-align:center;">${prof.emoji}</td>
      <td style="padding:4px 10px 4px 0;font-size:12px;color:${isPri ? '#0f1628' : '#6a7090'};font-weight:${isPri ? '700' : '400'};white-space:nowrap;min-width:140px;">${prof.name}${isPri ? `&nbsp;<span style="background:${pri.accent};color:#fff;font-size:8px;border-radius:3px;padding:2px 5px;font-weight:700;vertical-align:middle;">PRIMARY</span>` : ''}</td>
      <td style="padding:4px 0;width:100%;"><div style="background:#eef0f6;border-radius:3px;height:6px;width:100%;"><div style="background:${barColor};border-radius:3px;height:6px;width:${p2}%;"></div></div></td>
      <td style="padding:4px 0 4px 10px;font-size:11px;color:#b0b8cc;text-align:right;white-space:nowrap;">${p2}%</td>
    </tr>`;
  }).join('');

  const rBarRows = sortedR.map((role) => {
    const isPri = role.id === priRole.id;
    const rp = pct(role, maxR);
    const barColor = isPri ? role.accent : '#b0bdd4';
    return `<tr>
      <td style="padding:4px 10px 4px 0;font-size:15px;white-space:nowrap;width:26px;text-align:center;">${role.emoji}</td>
      <td style="padding:4px 10px 4px 0;font-size:12px;color:${isPri ? '#0f1628' : '#6a7090'};font-weight:${isPri ? '700' : '400'};white-space:nowrap;min-width:120px;">${role.name}${isPri ? `&nbsp;<span style="background:${role.accent};color:#fff;font-size:8px;border-radius:3px;padding:2px 5px;font-weight:700;vertical-align:middle;">MATCH</span>` : ''}</td>
      <td style="padding:4px 0;width:100%;"><div style="background:#eef0f6;border-radius:3px;height:6px;width:100%;"><div style="background:${barColor};border-radius:3px;height:6px;width:${rp}%;"></div></div></td>
      <td style="padding:4px 0 4px 10px;font-size:11px;color:#b0b8cc;text-align:right;white-space:nowrap;">${rp}%</td>
    </tr>`;
  }).join('');

  const strengthItems = pri.strengths.map((s) =>
    `<li style="margin-bottom:6px;font-size:13px;color:#2a2d44;line-height:1.6;">${s}</li>`
  ).join('');
  const growthItems = pri.growth.map((g) =>
    `<li style="margin-bottom:6px;font-size:13px;color:#4a5070;line-height:1.6;">${g}</li>`
  ).join('');

  const tipCards = pri.tips.map((tip) =>
    `<div style="background:#eaf1f8;border:1.5px solid #b8cfe0;border-radius:8px;padding:14px 16px;margin-bottom:10px;">
      <div style="font-size:13px;font-weight:700;color:#0f1628;margin-bottom:6px;">\u{1F4A1} ${tip.label}</div>
      <div style="font-size:13px;color:#4a5070;line-height:1.75;">${tip.text}</div>
    </div>`
  ).join('');

  const roleCharItems = priRole.characteristics.map((c) =>
    `<li style="margin-bottom:6px;font-size:13px;color:#2a2d44;line-height:1.6;">${c}</li>`
  ).join('');

  const personaCards = sortedP.map((prof) => {
    const isMe = prof.id === pri.id;
    const traitPills = prof.strengths.map((s) =>
      `<span style="display:inline-block;font-size:10px;border-radius:20px;padding:3px 9px;font-weight:500;border:1px solid ${prof.accent};color:${prof.accent};background:#fff;margin:2px 3px 2px 0;line-height:1.5;">${s}</span>`
    ).join('');
    return `<div style="border-radius:10px;padding:18px 20px;margin-bottom:12px;border:1.5px solid ${isMe ? prof.accent : '#e8eaf0'};border-left:4px solid ${prof.accent};background:${isMe ? '#f8fcff' : '#fafbfc'}">
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:8px;"><tr>
        <td style="font-size:26px;line-height:1;width:38px;vertical-align:top;">${prof.emoji}</td>
        <td style="vertical-align:top;padding-left:10px;">
          <div style="font-size:14px;font-weight:700;color:#0f1628;">${prof.name}${isMe ? `&nbsp;<span style="font-size:8px;background:${prof.accent};color:#fff;border-radius:3px;padding:2px 6px;font-weight:700;vertical-align:middle;">YOUR PROFILE</span>` : ''}</div>
          <div style="font-size:9px;color:${prof.accent};letter-spacing:0.17em;text-transform:uppercase;font-weight:600;margin-top:2px;">${prof.tagline}</div>
        </td>
      </tr></table>
      <div style="font-size:13px;color:#4a5070;line-height:1.8;margin-bottom:10px;">${prof.desc}</div>
      <div style="font-size:9px;letter-spacing:0.17em;text-transform:uppercase;color:#b0b8cc;font-weight:600;margin-bottom:6px;">Key Traits</div>
      <div>${traitPills}</div>
    </div>`;
  }).join('');

  const roleCards = sortedR.map((role) => {
    const isMe = role.id === priRole.id;
    const charPills = role.characteristics.map((c) =>
      `<span style="display:inline-block;font-size:10px;border-radius:20px;padding:3px 9px;font-weight:500;border:1px solid ${role.accent};color:${role.accent};background:#fff;margin:2px 3px 2px 0;line-height:1.5;">${c}</span>`
    ).join('');
    return `<div style="border-radius:10px;padding:18px 20px;margin-bottom:12px;border:1.5px solid ${isMe ? role.accent : '#e8eaf0'};border-left:4px solid ${role.accent};background:${isMe ? '#fdf8f5' : '#fafbfc'}">
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:8px;"><tr>
        <td style="font-size:26px;line-height:1;width:38px;vertical-align:top;">${role.emoji}</td>
        <td style="vertical-align:top;padding-left:10px;">
          <div style="font-size:14px;font-weight:700;color:#0f1628;">${role.name}${isMe ? `&nbsp;<span style="font-size:8px;background:${role.accent};color:#fff;border-radius:3px;padding:2px 6px;font-weight:700;vertical-align:middle;">YOUR MATCH</span>` : ''}</div>
          <div style="font-size:9px;color:${role.accent};letter-spacing:0.17em;text-transform:uppercase;font-weight:600;margin-top:2px;">${role.tagline}</div>
        </td>
      </tr></table>
      <div style="font-size:13px;color:#4a5070;line-height:1.8;margin-bottom:10px;">${role.desc}</div>
      <div style="font-size:9px;letter-spacing:0.17em;text-transform:uppercase;color:#b0b8cc;font-weight:600;margin-bottom:6px;">Key Characteristics</div>
      <div style="margin-bottom:10px;">${charPills}</div>
      <div style="background:#fff;border-radius:6px;padding:10px 14px;border:1px solid #e4e8f0;">
        <div style="font-size:9px;letter-spacing:0.17em;text-transform:uppercase;color:#b0b8cc;font-weight:600;margin-bottom:4px;">Role Impact</div>
        <div style="font-size:12px;color:#4a5070;line-height:1.7;">${role.impact}</div>
      </div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>RedRock Sales Assessment \u2014 ${S.userName}</title><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#f4f6fa;color:#1a1a2e;}
    @media print{body{background:#fff;}.page-wrap{box-shadow:none!important;max-width:100%!important;}}
  </style></head><body>
  <div class="page-wrap" style="max-width:680px;margin:0 auto;background:#fff;padding:40px 36px 60px;box-shadow:0 2px 24px rgba(0,0,0,0.07);">
    <div style="text-align:center;margin-bottom:36px;padding-bottom:28px;border-bottom:2px solid #eef0f6;">
      <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:12px;">RedRock Sales Assessment</div>
      <div style="font-size:11px;color:#b0b8cc;margin-bottom:4px;">Results for <strong style="color:#4a5070;">${S.userName}</strong></div>
      <div style="font-size:11px;color:#b0b8cc;">${date}</div>
    </div>
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:14px;">Your Primary Seller Persona</div>
      <div style="font-size:56px;line-height:1;margin-bottom:12px;">${pri.emoji}</div>
      <div style="font-size:32px;font-weight:800;color:#0f1628;letter-spacing:-0.5px;margin-bottom:6px;">${pri.name}</div>
      <div style="font-size:9px;color:${pri.accent};letter-spacing:0.2em;text-transform:uppercase;font-weight:700;margin-bottom:18px;">${pri.tagline}</div>
      <div style="font-size:14px;color:#4a5070;line-height:1.85;max-width:500px;margin:0 auto;">${pri.desc}</div>
    </div>
    <div style="background:#f8f9fc;border:1.5px solid #e8eaf0;border-left:3px solid ${pri.accent};border-radius:10px;padding:20px;margin-bottom:12px;">
      <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:12px;">Core Strengths</div>
      <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;">${strengthItems}</ul>
    </div>
    <div style="background:#f8f9fc;border:1.5px solid #dde2ef;border-left:3px solid #dde2ef;border-radius:10px;padding:20px;margin-bottom:24px;">
      <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:12px;">Growth Opportunities</div>
      <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;">${growthItems}</ul>
    </div>
    <div style="margin-bottom:32px;">
      <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:12px;">Actionable Development Tips</div>
      ${tipCards}
    </div>
    <div style="margin-bottom:36px;">
      <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:14px;">All Persona Scores</div>
      <table cellpadding="0" cellspacing="0" style="width:100%;">${pBarRows}</table>
    </div>
    <div style="border-top:2px solid #eef0f6;margin:36px 0 28px;"></div>
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:6px;">Your Most Likely Sales Role Match</div>
    <div style="font-size:12px;color:#9aa0b8;line-height:1.65;margin-bottom:20px;">Based on your persona profile, here is how your natural style maps to the four sales role types \u2014 and which role is your best fit.</div>
    <div style="border-radius:10px;padding:22px;margin-bottom:20px;border:1.5px solid ${priRole.accent};border-left:4px solid ${priRole.accent};background:linear-gradient(135deg,#fafbfc 0%,#f5f8fb 100%);">
      <div style="display:inline-block;font-size:8px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:3px 10px;border-radius:20px;background:${priRole.accent};color:#fff;margin-bottom:14px;">Best Role Match</div>
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:14px;"><tr>
        <td style="font-size:36px;line-height:1;width:52px;vertical-align:top;">${priRole.emoji}</td>
        <td style="vertical-align:top;padding-left:12px;">
          <div style="font-size:20px;font-weight:800;color:#0f1628;margin-bottom:4px;">${priRole.name}</div>
          <div style="font-size:9px;color:${priRole.accent};letter-spacing:0.18em;text-transform:uppercase;font-weight:700;margin-bottom:10px;">${priRole.tagline}</div>
          <div style="font-size:13.5px;color:#4a5070;line-height:1.8;">${priRole.desc}</div>
        </td>
      </tr></table>
      <div style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#b0b8cc;font-weight:600;margin-bottom:10px;">Key Characteristics</div>
      <ul style="list-style:none;padding:0;margin:0 0 14px 0;display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;">${roleCharItems}</ul>
      <div style="background:#fff;border-radius:7px;padding:12px 14px;border:1px solid #dde8f0;">
        <div style="font-size:9px;letter-spacing:0.17em;text-transform:uppercase;color:#b0b8cc;font-weight:600;margin-bottom:5px;">Role Impact</div>
        <div style="font-size:12.5px;color:#4a5070;line-height:1.7;">${priRole.impact}</div>
      </div>
    </div>
    <div style="margin-bottom:40px;">
      <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:14px;">All Role Scores</div>
      <table cellpadding="0" cellspacing="0" style="width:100%;">${rBarRows}</table>
    </div>
    <div style="border-top:2px solid #eef0f6;margin:36px 0 24px;"></div>
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:6px;">All Six Seller Personas \u2014 Reference Guide</div>
    <div style="font-size:12px;color:#9aa0b8;line-height:1.6;margin-bottom:18px;">A summary of all six personas so you can see where you landed \u2014 and what each of the others represents.</div>
    ${personaCards}
    <div style="border-top:2px solid #eef0f6;margin:36px 0 24px;"></div>
    <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#9aa0b8;font-weight:600;margin-bottom:6px;">All Four Sales Roles \u2014 Reference Guide</div>
    <div style="font-size:12px;color:#9aa0b8;line-height:1.6;margin-bottom:18px;">A summary of the four sales role types so you understand the full landscape of how seller responsibilities are defined.</div>
    ${roleCards}
    <div style="border-top:1.5px solid #eef0f6;padding-top:22px;margin-top:20px;text-align:center;">
      <div style="font-size:10px;color:#c0c6d8;">RedRock Sales Assessment \u00B7 6 Personas \u00B7 4 Sales Roles</div>
    </div>
  </div></body></html>`;
}
