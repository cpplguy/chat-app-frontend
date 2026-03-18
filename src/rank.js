export const RANKS = {
  founder:  { label: "Founder", color: "#FF0000", badge: "👑" },
  owner:    { label: "Owner",   color: "#00BFFF", badge: "⭐" },
  admin:    { label: "Admin",   color: "#BF5AF2", badge: "🛡️" },
  mod:      { label: "Mod",     color: "#FFD700", badge: "🔨" },
  donor:    { label: "Donor",   color: "#00C853", badge: "💚" },
  member:   { label: "Member",  color: "#555555", badge: "👤" },
};

export const getRankBadge = (rank) => {
  const r = RANKS[rank] ?? RANKS.member;
  return <span style={{color:r.color, fontSize:"0.7rem", fontWeight:"bold", border:`1px solid ${r.color}`, borderRadius:"999px", padding:"1px 6px", marginLeft:"4px"}}>{r.badge} {r.label}</span>;
};
