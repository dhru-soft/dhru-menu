import React, {
    createContext, memo,
    useEffect, useState,
} from 'react';
import { useContext } from 'react';


const defaultData: any = {

};

const Index = createContext<any>(defaultData);

export const SampleProvider = memo((props: any) => {
    const {children} = props
    const [loading,setLoading] = useState(false)

    const init = () => {
        setTimeout(()=>{
            //setLoading(true)
        },1000)
        console.log('init content')
    }

    useEffect(() => {
        if (!window) {
            return;
        }
        init()
    }, []);

    if(!loading) {
        return <> </>
    }

    return <Index.Provider value={{loading}}>
        {children}
    </Index.Provider>;
});


const useSampleContext = () => useContext(Index)
export default useSampleContext;
export const SampleConsumer = Index.Consumer






//   const values = useSampleContext()

/*    <SampleProvider>
        <SampleConsumer>
            {(props: any) => {
                return <Component {...props}></Component>
        }}
    </SampleConsumer>
</SampleProvider>*/
