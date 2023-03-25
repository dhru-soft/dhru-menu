import React, { useRef, useLayoutEffect } from 'react'
function Layout() {
    const stickyHeader = useRef()
    useLayoutEffect(() => {
        const mainHeader = document.getElementById('mainHeader')
        let fixedTop = stickyHeader.current.offsetTop
        const fixedHeader = () => {
            if (window.pageYOffset > fixedTop) {
                mainHeader.classList.add('fixedTop')
            } else {
                mainHeader.classList.remove('fixedTop')
            }
        }
        window.addEventListener('scroll', fixedHeader)
    }, [])
    return (
        <div>
            <div className="mainHeader" id="mainHeader" ref={stickyHeader}>
                <h2>React Js onScroll Sticky Header Example</h2>
            </div>
            <div className="main-block">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                    lacinia pretium erat ac rutrum.
                </p>
                <p>
                    Suspendisse in nulla augue pellentesque, lorem sed ullamcorper
                    facilisis, tortor risus gravida arcu, nec tempor leo massa vel nisl.
                </p>
                <p>
                    Nullam tincidunt est vitae tempus pretium. Sed diam tortor, luctus sed
                    neque vel, vulputate vehicula nunc.
                </p>
                <p>
                    Curabitur a vestibulum lorem, id hendrerit elit. Quisque vestibulum
                    diam nisl, in tempus arcu varius at. Nulla placerat nibh quis mauris
                    dapibus blandit. Maecenas sollicitudin sapien eget consequat viverra.
                </p>
                <p>
                    Proin iaculis velit a velit luctus, at porta tortor tincidunt,
                    Suspendisse non consectetur sem.
                </p>
                <p>
                    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                    posuere cubilia curae; Sed varius bibendum nibh, nec vulputate est.{' '}
                </p>
                <p>
                    Sed a ante luctus, faucibus est blandit, bibendum nisi. Sed non magna
                    tellus.
                </p>
                <p>
                    Ut semper egestas facilisis. Quisque porttitor vel metus sit amet
                    dapibus.
                </p>
                <p>
                    Maecenas sollicitudin dictum aliquam. Praesent iaculis ac tellus non
                    iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus.
                </p>
                <p>
                    Etiam interdum odio vel ipsum maximus suscipit. Ut at nunc a risus
                    efficitur euismod. Phasellus blandit vehicula purus, rutrum pretium
                    turpis commodo non.
                </p>
                <p>
                    Integer ullamcorper faucibus dolor ut aliquam. Cras non nibh finibus,
                    vestibulum turpis sed, congue risus. Duis maximus diam augue, ac porta
                    nisi aliquet sit amet.{' '}
                </p>
                <p>
                    Proin quis tortor at arcu pretium maximus. Donec sollicitudin pretium
                    vestibulum. Nunc ut erat vestibulum, aliquet est at, fringilla elit.
                    Integer vitae nisl diam. Nam vehicula pharetra congue.{' '}
                </p>
                <p>
                    Vestibulum sed consequat ante. Phasellus lacinia erat eget interdum
                    egestas. Fusce eu convallis lorem. Quisque pulvinar pulvinar justo.
                </p>
                <p>
                    Donec suscipit ante vitae ante consectetur, at elementum tortor
                    auctor. Nulla non congue nulla.
                </p>
                <p>
                    Etiam tincidunt velit ligula, in lacinia augue tristique sed.
                    Vestibulum consectetur lorem vitae quam vestibulum, in finibus turpis
                    maximus.
                </p>
                <p>
                    Quisque pellentesque purus diam, sed vestibulum odio consectetur ac.
                    Orci varius natoque penatibus et magnis dis parturient montes,
                    nascetur ridiculus mus.
                </p>
                <p>
                    Nam egestas congue dignissim. Morbi porta congue augue, a faucibus ex
                    tincidunt eget. Sed scelerisque dictum sapien eget tempus.
                </p>
                <p>
                    Nulla dictum urna arcu, in dapibus sem sagittis sed. Donec metus nisi,
                    imperdiet at nulla non, ornare porttitor lacus. Cras diam dolor,
                    porttitor eget neque non, euismod eleifend enim.
                </p>
                <p>
                    Ut neque ipsum, rutrum sed commodo nec, efficitur eu augue. Donec ac
                    felis at ligula molestie fringilla. Cras vel mi orci. In et massa
                    venenatis, molestie tellus sit amet, volutpat mi.
                </p>
            </div>
        </div>
    )
}
export default Layout
