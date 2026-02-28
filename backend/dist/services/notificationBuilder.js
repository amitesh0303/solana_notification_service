"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNotification = buildNotification;
function buildNotification(event) {
    switch (event.type) {
        case 'transfer':
            return buildTransfer(event);
        case 'nft_sale':
            return buildNftSale(event);
        case 'defi_position':
            return buildDefiPosition(event);
        case 'token_transfer':
            return buildTokenTransfer(event);
        case 'program_interaction':
            return buildProgramInteraction(event);
        default:
            return buildGeneric(event);
    }
}
function buildTransfer(event) {
    const amount = event.data['amount'];
    const from = event.data['from'];
    const to = event.data['to'];
    const amountStr = amount !== undefined ? `${amount} SOL` : 'an unknown amount';
    const subject = `SOL Transfer Detected`;
    const plainText = `Transfer of ${amountStr} detected.\n` +
        (from ? `From: ${from}\n` : '') +
        (to ? `To: ${to}\n` : '') +
        `Signature: ${event.signature}`;
    const htmlBody = `
    <h2>SOL Transfer Detected</h2>
    <p>A transfer of <strong>${amountStr}</strong> was detected.</p>
    ${from ? `<p><strong>From:</strong> ${from}</p>` : ''}
    ${to ? `<p><strong>To:</strong> ${to}</p>` : ''}
    <p><strong>Signature:</strong> <code>${event.signature}</code></p>
    <p><strong>Time:</strong> ${new Date(event.timestamp * 1000).toUTCString()}</p>
  `;
    return { subject, htmlBody, plainText };
}
function buildNftSale(event) {
    const salePrice = event.data['salePrice'];
    const nftMint = event.data['nftMint'];
    const priceStr = salePrice !== undefined ? `${salePrice} SOL` : 'an unknown price';
    const subject = `NFT Sale Detected`;
    const plainText = `NFT sold for ${priceStr}.\n` +
        (nftMint ? `NFT Mint: ${nftMint}\n` : '') +
        `Signature: ${event.signature}`;
    const htmlBody = `
    <h2>NFT Sale Detected</h2>
    <p>An NFT was sold for <strong>${priceStr}</strong>.</p>
    ${nftMint ? `<p><strong>NFT Mint:</strong> <code>${nftMint}</code></p>` : ''}
    <p><strong>Signature:</strong> <code>${event.signature}</code></p>
    <p><strong>Time:</strong> ${new Date(event.timestamp * 1000).toUTCString()}</p>
  `;
    return { subject, htmlBody, plainText };
}
function buildDefiPosition(event) {
    const protocol = event.data['protocol'];
    const action = event.data['action'];
    const subject = `DeFi Position Update`;
    const plainText = `DeFi position update detected.\n` +
        (protocol ? `Protocol: ${protocol}\n` : '') +
        (action ? `Action: ${action}\n` : '') +
        `Signature: ${event.signature}`;
    const htmlBody = `
    <h2>DeFi Position Update</h2>
    ${protocol ? `<p><strong>Protocol:</strong> ${protocol}</p>` : ''}
    ${action ? `<p><strong>Action:</strong> ${action}</p>` : ''}
    <p><strong>Signature:</strong> <code>${event.signature}</code></p>
    <p><strong>Time:</strong> ${new Date(event.timestamp * 1000).toUTCString()}</p>
  `;
    return { subject, htmlBody, plainText };
}
function buildTokenTransfer(event) {
    const tokenMint = event.data['tokenMint'];
    const amount = event.data['amount'];
    const amountStr = amount !== undefined ? `${amount}` : 'an unknown amount';
    const subject = `Token Transfer Detected`;
    const plainText = `Token transfer of ${amountStr} detected.\n` +
        (tokenMint ? `Token Mint: ${tokenMint}\n` : '') +
        `Signature: ${event.signature}`;
    const htmlBody = `
    <h2>Token Transfer Detected</h2>
    <p>A token transfer of <strong>${amountStr}</strong> was detected.</p>
    ${tokenMint ? `<p><strong>Token Mint:</strong> <code>${tokenMint}</code></p>` : ''}
    <p><strong>Signature:</strong> <code>${event.signature}</code></p>
    <p><strong>Time:</strong> ${new Date(event.timestamp * 1000).toUTCString()}</p>
  `;
    return { subject, htmlBody, plainText };
}
function buildProgramInteraction(event) {
    const programId = event.data['programId'];
    const subject = `Program Interaction Detected`;
    const plainText = `Program interaction detected.\n` +
        (programId ? `Program: ${programId}\n` : '') +
        `Signature: ${event.signature}`;
    const htmlBody = `
    <h2>Program Interaction Detected</h2>
    ${programId ? `<p><strong>Program:</strong> <code>${programId}</code></p>` : ''}
    <p><strong>Signature:</strong> <code>${event.signature}</code></p>
    <p><strong>Time:</strong> ${new Date(event.timestamp * 1000).toUTCString()}</p>
  `;
    return { subject, htmlBody, plainText };
}
function buildGeneric(event) {
    const subject = `Solana Event: ${event.type}`;
    const plainText = `Solana event of type "${event.type}" detected.\nSignature: ${event.signature}`;
    const htmlBody = `
    <h2>Solana Event Detected</h2>
    <p><strong>Type:</strong> ${event.type}</p>
    <p><strong>Signature:</strong> <code>${event.signature}</code></p>
    <p><strong>Time:</strong> ${new Date(event.timestamp * 1000).toUTCString()}</p>
  `;
    return { subject, htmlBody, plainText };
}
//# sourceMappingURL=notificationBuilder.js.map