import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {clone, isEmpty, saveLocalSettings} from "../../lib/functions";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";


const Index = (props) => {

    const dispatch = useDispatch()
    const {hidetag,selectedtags,options} = props;

    const [tags,setTags] = useState(selectedtags);

    useEffect(()=>{
        /// selected tag
        setTags(selectedtags || [
            {label:'Veg',value:'veg',selected:false,icon:'leaf',color:'#659a4a',label2:'Pure Veg'},
            {label:'Non Veg',value:'nonveg',selected:false,icon:'meat',color:'#ee4c4c',label2:'Only Non Veg'},
            {label:'Egg',value:'egg',selected:false,icon:'egg',color:'gray',label2:'Only Egg'},
        ]?.filter((tag)=>{
            return options && Boolean(options[tag?.value])
        }))
    },[options])

    if(hidetag){
        return <></>
    }

    if(Boolean(tags?.length === 1)){
        const {label2,icon,color} = tags[0]
        return <div> <i style={{color:color}} className={`fa fa-${icon}`}></i> {label2}</div>
    }

    return (
        <div className={'col-12'}>

            <div>
                <div className="">
                    {<div>
                        <div className={'overflow-auto d-flex tags'}>
                            {
                                tags?.map((tag,index)=>{
                                    return <button key={index} type="button" onClick={()=>{
                                        let ctags = {
                                            ...tags,
                                            [index]:{...tag,selected:!tag.selected}
                                        }
                                        const copytags = clone(Object.values(ctags))
                                        setTags(copytags)

                                        dispatch(setSelected({selectedtags: copytags}))
                                    }} className={`border rounded-4 px-4 btn ${tag.selected?'btn-danger':'bg-white'}`} > {tag.selected ? <i className={'fa fa-check'}></i> : <i style={{color:tag.color}} className={`fa fa-${tag.icon}`}></i>} <span>{tag.label}</span>  </button>
                                })
                            }
                        </div>
                    </div>}

                </div>
            </div>

        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        ...state.selectedData,
        options: state.restaurantDetail?.settings?.options

    }
}

export default connect(mapStateToProps)(Index);

