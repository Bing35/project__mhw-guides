const { useState, useEffect } = React

function App(props) {
    const [monsterId, setMonsterId] = useState(36)
    const [monster, setMonster] = useState(undefined)
    let list = []

    function render() {
        if (monster === undefined) {
            return 'loading'
        }
        else {
            return (
                <div>
                    <header>
                        <Nav setMonsterId={setMonsterId} />
                    </header>
                    <main>
                        <Title name={monster.name} />
                        <Stats monster={monster} />
                    </main>
                </div>

            )
        }

    }

    // fetch data for monster
    useEffect(function () {
        fetch('https://mhw-db.com/monsters/' + monsterId)
            .then(response => response.json())
            .then(response => {
                setMonster(response)
            })
    }, [monsterId])

    // change document title
    useEffect(function () {
        if (monster === undefined) { return }
        document.title = monster.name
    }, [monster])


    return render()

}

function Nav(props) {
    const [viewport, setViewport] = useState(undefined)

    function render() {

        if (viewport === undefined) {
            return 'undefined'
        }
        else if (viewport === 'sm') {
            return (
                <nav>
                    <span onClick={showNav}>Menu</span>
                    <div>
                        <ul className='nav flex-column'>
                            <li className='nav-item'><a className='nav-link'><Search
                                setMonsterId={props.setMonsterId}
                                showNav={showNav}
                                viewport={viewport}
                            /></a></li>
                            <li className="nav-item"><a className='nav-link'>About Us</a></li>
                        </ul>
                    </div>
                </nav>
            )
        }
        else {
            return (
                // <nav className='navbar navbar-expand-sm bg-secondary navbar-dark'>
                <nav>
                    <ul className='nav'>
                        <li className='nav-item'><a className='nav-link'><Search
                            setMonsterId={props.setMonsterId}
                            showNav={() => null}
                            viewport={viewport}
                        /></a></li>
                        <li className="nav-item"><a className='nav-link'>About Us</a></li>
                    </ul>
                </nav>
            )
        }

    }

    // initialize display
    useEffect(function () {
        const navDiv = document.querySelector('nav>div')
        if (navDiv !== null) {
            document.querySelector('nav>div').style.display = 'none';
        }
    }, [viewport])

    // viewport changes
    useEffect(function () {
        changeViewport()
    }, [])

    useEffect(function () {
        document.querySelector('body').onresize = changeViewport
    })


    function changeViewport() {
        if (window.innerWidth < 1000) {
            if (viewport !== 'sm') {
                setViewport('sm')
            }
        }
        else {
            if (viewport !== 'lg') {
                setViewport('lg')
            }
        }
    }



    return render()
}

function Search(props) {
    const [search, setSearch] = useState('')
    const [monsters, setMonsters] = useState(undefined)
    const [monsterList, setMonsterList] = useState([])
    const invalidInput = [{
        'name': 'invalid input',
        'id': 1
    }]

    function render() {

        return (
            <div>
                <input type="text" onChange={changeSearch} value={search} placeholder='Search' />
                <ul id='monster-list'>
                    {monsterList}
                </ul>
            </div>
        )
    }

    // fetch data for monsters
    useEffect(function () {
        if (search === '') {
            // clear ajax problem
            setTimeout(() => {
                setMonsters(undefined)
            }, 500);
            return
        }
        fetch(`https://mhw-db.com/monsters?q={"name": {"$like": "%${search}%"}}`)
            .then(response => response.json())
            .then(response => {
                // verify if it is list
                if (response.length === undefined) {
                    console.log('error');
                    setMonsters(invalidInput)
                    return
                }

                setMonsters(response)
            })

    }, [search])

    // set monsterList
    useEffect(function () {
        if (monsters === undefined) {
            setMonsterList([])
            console.log('monster undefined');
            document.querySelector('#monster-list').style.display = 'none'
        }
        else {
            console.log('monster = monsterlist');
            setMonsterList(monsters.map(item => (
                <li key={item.name} ><button onClick={setMonsterId} data-id={item.id} className='btn btn-light'>{item.name}</button></li>
            )))
            if (props.viewport === 'lg') {
                document.querySelector('#monster-list').style.display = 'flex'
            }
            else {
                document.querySelector('#monster-list').style.display = 'block'
            }
        }
    }, [monsters])


    function setMonsterId(e) {
        props.setMonsterId(e.target.dataset.id)
        setSearch('')
        props.showNav()
    }

    function changeSearch(e) {
        setSearch(e.target.value)
    }

    return render()
}

function Title(props) {
    return (
        <h2>{props.name}</h2>
    )
}

function Stats(props) {
    // generate spam text
    const list = []
    for (let i = 0; i < 50; i++) {
        list.push('this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.this is some text.')
    }

    return (
        <div id='stats' className='row'>
            {/* parts dmg sever, blunt, range */}
            <table>
            </table>

            {/* elemental parts dmg */}
            <table>

            </table>

            {/* ailments it deals */}
            <table className='col-lg-4'>
                <thead>
                    <tr><th>Ailments</th></tr>
                </thead>
                <tbody>
                    {props.monster.ailments.map((ailment) => (
                        <tr key={ailment.name}><td>{ailment.name}</td></tr>
                    ))}
                </tbody>
            </table>

            {/* locations */}
            <table className='col-lg-4'>
                <thead>
                    <tr>
                        <th>Location</th><th>Zone</th>
                    </tr>
                </thead>
                <tbody>
                    {props.monster.locations.map(location => (
                        <tr key={location.name}>
                            <td>{location.name}</td><td>{location.zoneCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* spam text */}
            {/* {list.map((p, index) => (
                <p key={index}>
                    {p}
                </p>
            ))} */}

        </div>
    )
}

function showNav() {
    const style = document.querySelector('nav>div').style
    if (style.display !== 'none') {
        style.display = 'none'
    }
    else {
        style.display = 'block'
    }
}


ReactDOM.render(<App />, document.querySelector('#root'))