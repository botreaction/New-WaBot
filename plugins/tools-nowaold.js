let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command,
    isOwner
}) => {
    if (!text) throw `Input Valid Number`
    if (!text.match(/x/g)) throw `*Example :* ${usedPrefix + command} ${m.sender.split('@')[0]}x`
    if (text.match(/x/g).length > 2 && !isOwner) throw `To Many "x" On Query !`
    let detect = text.replace(/[^0-9|x]/g, '')
    if (detect.length < 5) throw `You Put Invalid Number`
    await m.reply(wait)
    let data = await nowa(conn, detect)
    let txt = '\t*• 2009 - 2016 •*\n' + data.filter(v => v.exists && !/Date/.test(v.setAt) && /09|1[0-6]$/.test(v.setAt))
        .map(v => `No : @${splitM(v.jid)}\nBio : ${v.status || ''}\nDate : ${v.setAt}`).join('\n\n') +
        '\n\n\t*• 2017 - NOW •*\n' + data.filter(v => v.exists && /1[7-9]|2[0-2]$/.test(v.setAt))
        .map(v => `@${splitM(v.jid)}`).join('\n') +
        '\n\n\t*• INVALID DATE •*\n' + data.filter(v => v.exists && /Date/.test(v.setAt))
        .map(v => `@${splitM(v.jid)}`).join('\n')
    m.reply(txt, '', {
        mentions: data.map(x => x.jid)
    })
}
handler.help = ['NowaOld']
handler.tags = ['tools']
handler.command = /^nowaold$/i
handler.limit = 3

export default handler

function splitM(num) {
    return num.split('@')[0]
}

function formatDate(n, locale = 'id') {
    n = +n
    if (n == 0) n = NaN
    let d = new Date(n)
    return d.toLocaleDateString(locale, {
        timeZone: 'Asia/Jakarta'
    })
}

export async function nowa(client, num) {
    let random = num.match(/x/g).length,
        total = Math.pow(10, random),
        arr = []
    for (let i = 0; i < total; i++) {
        let list = [...i.toString().padStart(random, '0')],
            result = num.replace(/x/g, () => list.shift()) + '@s.whatsapp.net'
        if (await client.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
            let info = await client.fetchStatus(result).catch(() => {}) || {}
            info.setAt = formatDate(info?.setAt)
            arr.push({
                exists: true,
                jid: result,
                ...info
            })
        } else {
            arr.push({
                exists: false,
                jid: result
            })
        }
    }
    return arr
}