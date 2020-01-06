const Right = x => 
({
    map: f => Right(f(x)),
    chain: f => f(x),
    fold: (f, g) => g(x)
})

const Left = x => 
({
    map: f => Left(x),
    chain: f => Left(x),
    fold: (f, g) => f(x)
})

const fromNullable = x =>
    x != null ? Right(x) : Left(null)

/*-----------------------------*/

const openSiteImperative = () => {
    if (current_user) {
        return renderPage(current_user)
    } else {
        return showLogin()
    }
}

const openSiteEither = () => 
    fromNullable(current_user)
    .fold(showLogin, renderPage)

/*-----------------------------*/

const getPrefsImperative = () => {
    if (user.premium) {
        return loadPrefs(user.preferences)
    } else {
        return defaultPrefs
    }
}

const getPrefsEither = () =>
    (user.premium ? Right(user) : Left('not premium'))
    .map(u => u.preferences)
    .fold(() => defaultPrefs, prefs => loadPrefs(prefs))

/*-----------------------------*/

const streetNameImperative = user => {
    const address = user.address

    if (address) {
        const street = address.street

        if (street) {
            return street.name
        }
    }

    return 'no street'
}

const streetNameEither = user => 
    fromNullable(address)
    .chain(a => fromNullable(a.street))
    .map(s => s.name)
    .fold(e => 'no street', n => n)

/*-----------------------------*/

const concatUniqImperative = (x, ys) => {
    const found = ys.filter(y => y === x)[0]
    return found ? ys : ys.concat(x)
}

const concatUniqEither = (x, ys) => 
    fromNullable(ys.filter(y => y === x)[0])
    .fold(() => ys.concat(x), y => ys)

/*-----------------------------*/

const wrapExamplesImperative = example => {
    if (example.previewPath) {
        try {
            example.preview = fs.readFileSync(example.previewPath)
        } catch (e) { }
    }

    return example
}


const readFile = x => tryCatch(() => fs.readFileSync(example.previewPath))

const wrapExamplesEither = example =>
    fromNullable(example.previewPath)
    .fold(
        () => example,
        ex => Object.assign({preview: p}, ex)
    )

/*-----------------------------*/

const parseDbUrlImperative = cfg => {
    try {
        const c = JSON.parse(cfg)
        if (c.url) {
            return c.url.match('/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/')
        }
    } catch (e) {
        return null
    }
}

const parseDbUrlEither = cfg => 
    tryCatch(() => JSON.parse(cfg))
    .chain(c => fromNullable(c.url))
    .fold(e => null,
        u => u.match('/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/'))