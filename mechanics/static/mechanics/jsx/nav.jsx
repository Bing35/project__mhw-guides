const { useState, useEffect } = React

function Nav(props) {
    const [viewport, setViewport] = useState('sm')

    function render() {
        if (viewport === 'sm') {
            return (
                <div>
                    <span id='menu' onClick={toggleNav}>Menu</span>
                    <div>
                        <ul className='nav'>
                            <li className='nav-item'><span className='nav-link'><Search
                                toggleNav={toggleNav}
                                viewport={viewport}
                            /></span></li>
                            <li className="nav-item"><a className='nav-link' href={document.querySelector('#about-url').value}>About Us</a></li>
                        </ul>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    <ul className='nav'>
                        <li className='nav-item'><span className='nav-link'><Search
                            toggleNav={() => null}
                            viewport={viewport}
                        /></span></li>
                        <li className="nav-item"><a className='nav-link' href={document.querySelector('#about-url').value}>About Us</a></li>
                    </ul>
                </div>
            )
        }

    }

    // to change 
    // initialize display
    useEffect(function () {
        if (viewport === 'sm') {
            document.querySelector('nav>div>div').style.display = 'none';
        }
    }, [viewport])

    // viewport changes
    useEffect(function () {
        changeViewport()
        document.querySelector('body').onresize = changeViewport
    }, [viewport])


    function changeViewport() {
        if (window.innerWidth < 1000) {
            console.log(`changeviewport sm: ${viewport}`);
            if (viewport !== 'sm') {
                setViewport('sm')
            }
        }
        else {
            console.log(`changeviewport lg: ${viewport}`);
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
    const monsterUrl = document.querySelector('#monster-url').value.slice(0, -2)

    function render() {
        return (
            <div>
                <input type="text" onChange={changeSearch} value={search} placeholder='Search' />
                <ul id='monster-list' className='monster-list'>
                    {monsterList}
                </ul>
            </div>
        )
    }

    // fetch data for monsters
    useEffect(function () {
        if (search === '') {
            setMonsters(undefined)
            return
        }
        let controller = new AbortController()
        fetch(`https://mhw-db.com/monsters?q={"name": {"$like": "%${search}%"}}`, { signal: controller.signal })
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
            .catch(e => null)
        return () => controller.abort()

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
                <li key={item.name} ><a href={`${monsterUrl}${item.id}`}>
                    <button data-id={item.id} className='btn btn-light'>{item.name}</button>
                </a></li>
            )))
            if (props.viewport === 'lg') {
                document.querySelector('#monster-list').style.display = 'flex'
            }
            else {
                document.querySelector('#monster-list').style.display = 'block'
            }
        }
    }, [monsters])

    function changeSearch(e) {
        setSearch(e.target.value)
    }

    return render()
}

function toggleNav() {
    const style = document.querySelector('nav>div>div').style
    if (style.display !== 'none') {
        style.display = 'none'
    }
    else {
        style.display = 'block'
    }
}

ReactDOM.render(<Nav />, document.querySelector('#nav'))
