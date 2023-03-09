import React, {Component, useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {clone, isEmpty} from "../../lib/functions";
import {setSelected} from "../../lib/redux-store/reducer/selected-data";


const Index = (props) => {

    const dispatch = useDispatch()
    const {hidetag,selectedtags} = props;
    const [tags,setTags] = useState(selectedtags || [
        {label:'Veg',selected:false,icon:'leaf',color:'green'},
        {label:'Non Veg',selected:false,icon:'meat',color:'red'},
        {label:'Egg',selected:false,icon:'egg',color:'gray'},
        /*{label:'Jain',selected:false},
        {label:'Swaminarayan',selected:false},
        {label:'Gluten Free',selected:false},
        {label:'Lactose Free',selected:false},*/
    ]);





    return (
        <div className={'col-12'}>

            <div>
                <div className="">


                    {!hidetag &&  <div>
                        <div className={'overflow-auto d-flex tags   pb-4'}>
                            {
                                tags?.map((tag,index)=>{
                                    return <button key={index} type="button" onClick={()=>{
                                        let ctags = {
                                            ...tags,
                                            [index]:{...tag,selected:!tag.selected}
                                        }
                                        setTags(clone(Object.values(ctags)))
                                        const selected =  Object.values(ctags).filter((tag)=>{
                                            return  tag.selected
                                        })
                                        dispatch(setSelected({selectedtags: isEmpty(selected)?'':selected}))

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
        ...state.selectedData
    }
}

export default connect(mapStateToProps)(Index);

