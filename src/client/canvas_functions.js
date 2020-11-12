export function fillRoundedRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + (w /2), y);
    ctx.arcTo(x + w, y, x + w, y + (h / 2), r);
    ctx.arcTo(x + w, y + h, x + (w / 2), y + h, r);
    ctx.arcTo(x, y + h, x, y + (h / 2), r);
    ctx.arcTo(x, y, x + (w / 2), y, r);
    ctx.closePath();
    ctx.fill();
}
