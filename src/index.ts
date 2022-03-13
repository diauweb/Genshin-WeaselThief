import express from 'express'
import fse from 'fs-extra'
import path from 'path'
import { getAllDialogs, getDialog, getTalk, searchDialogContaining, searchTalkByDialog } from './dialog.js'
import * as git from './git.js'
import { getQuests } from './quest.js'
import { getNpc } from './role.js'
import { getText, searchText } from './text.js'


const app = express()
const fallbackIndex = (await fse.readFile(path.resolve('./web/public/index.html'))).toString()

app.use(express.static(path.resolve('web', 'public')))

const api = express.Router()
api.get('/status', function (req, res) {
    res.json({
        version: 1
    })
})

async function ensureArg (req: any, res: any, v: string , cb: (v: string) => Promise<void>) {
    if (req.query[v]) {
        await cb(req.query[v])
    } else {
        res.status(400)
        res.json({
            ok: false,
            error: 'No search criteria provided'
        })
    }
}

function query (route : string, cb : (q: string) => any) {
    api.get(route, async function(req, res) {
        ensureArg(req, res, 'q', async v => {
            try {
                res.json({ ok: true, ...await cb(v) })
            } catch (error) {
                res.status(500).json({ ok: false, error })
            }
        })
    })
}

query('/npc', q => getNpc(q))

api.get('/search_text', async function(req, res) {
    ensureArg(req, res, 'q', async v => {
        res.json({ ok: true, ...await searchText(v, req.query['lang'] as string) })
    })
})

api.get('/search_dialogs', async function(req, res) {
    ensureArg(req, res, 'q', async v => {
        res.json({ ok: true, result: await searchDialogContaining(v) })
    })
})

query('/search_talk', q => searchTalkByDialog(q))
query('/get_talk', q => getTalk(q))
query('/get_quests', q => getQuests(q))

api.get('/get_text', async function(req, res) {
    ensureArg(req, res, 't', async v => {
        res.json({ ok: true, text: await getText(v) })
    })
})

api.get('/get_dialog', async function(req, res) {
    ensureArg(req, res, 't', async v => {
        res.json({ ok: true, dialog: await getDialog(v) })
    })
})

api.get('/dialog_set', async function(req, res) {
    ensureArg(req, res, 't', async v => {
        res.json({ ok: true, dialogs: await getAllDialogs(v) })
    })
})

api.get('/version', async function (req, res) {
    let __version__ = 'dev'
    return res.json({ 
        ok: true, 
        version: __version__,
        dataVersion: await git.getDataVersion()
    })
})

api.get('/introspect', async function (req, res) {
    let __buildDate__ = 'dev'
    let __version__ = 'dev'
    let __branch__ = 'dev'
    let data, commit
    if (git.gitAvailable()) {
        data = await git.getStatus()
        commit = await git.getCommit()
    }

    res.json({
        ok: true,
        buildDate: __buildDate__,
        version: __version__,
        dataVersion: await git.getDataVersion(),
        branch: __branch__,
        vcs: git.gitAvailable(),
        status: data,
        commit
    })
})

app.use('/api', api)
app.use('*', function (req, res) {
    res.status(200).send(fallbackIndex)
})

app.listen(8081, () => {
    console.log('app serving at http://localhost:8081')
})
