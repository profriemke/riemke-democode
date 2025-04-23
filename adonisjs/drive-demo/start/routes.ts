/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'

router.on('/').render('pages/home')


router.post('/up', async ({ request, response})=>{
    const image = request.file('image', {size:'5mb', extnames:['jpg', 'png']})
    if(!image)
        return 'Fehler!'
    if(!image.isValid)
        return 'Datei entspricht nicht Vorgaben'
    const key = `${cuid()}.${image.extname}`
    await image.moveToDisk(key, 'fs')
    return await drive.use('fs').getUrl(key)

})

router.on('/secret').render('pages/geheim')

router.post('/geheim', async ({ request, view }) => {
   const image = request.file('image')
   if (!image) { return 'Fehler beim Upload' }
   const key = `${cuid()}.${image.extname}`
   await image.moveToDisk(key, 'secure')
   return view.render('pages/geheimesbild', {key: await drive.use('secure').getSignedUrl(key)})
})