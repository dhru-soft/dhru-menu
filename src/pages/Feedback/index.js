import React, {useEffect, useState} from "react";

import {Field, Form} from 'react-final-form'
import {device, required} from "../../lib/static";
import {connect} from "react-redux";
import BodyClassName from 'react-body-classname';
import Footer from "../Navigation/Footer";
import Image from "../../components/Image";
import Theme from "../Home/Theme";
import {clone} from "../../lib/functions";

const Index = (props) => {


    const onSubmit = (values) => {


    }

    const emoji = [
        'Sorry to hear. Tell us what went wrong?',
        'Sorry to hear. Tell us what went wrong?',
        'Sorry to hear. Tell us what went wrong?',
        'Glad to hear that. What did you like?',
        'Glad to hear that. What did you like?',
    ]

    const [selectedEmoji,setSelectedEmoji] = useState(2);
    let [categories,setCategories] = useState([{name:'Food',selected:false},{name:'Service',selected:false},{name:'Ambience',selected:false}])

    const handleCheckboxChange = (key,e) => {
        categories[key].selected = e.target.checked
        setCategories(clone(categories))

    }



    return (
        <BodyClassName className={'feedback'}>
            <>
                <Theme/>
            <div className="position-relative   h-100">
                <div className={'container p-4'}>
                    <div className="row justify-content-xl-between pt-5">
                        <div className="m-auto" style={{maxWidth:360}}>

                            <Form
                                initialValues={{feedback: ''}}
                                onSubmit={onSubmit}
                                render={({handleSubmit, values}) => (
                                    <form onSubmit={handleSubmit}>

                                        <div className={'form'}>

                                            <div className={'d-flex justify-content-between m-auto'} style={{width:330}}>
                                                {
                                                    emoji.map((emo,index)=>{
                                                        return (
                                                            <div key={index} className={`cursor-pointer emoji ${selectedEmoji === index ? 'active' : ''}`} onClick={()=>{
                                                                setSelectedEmoji(index)
                                                            }}> <Image name={`emoji_${index+1}.svg`} /> </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                            <div className="section-heading section-heading--center">
                                                <h4>{emoji[selectedEmoji]}</h4>
                                            </div>


                                            {
                                                categories?.map((category, key) => {
                                                    const {name, selected} = category;
                                                    return (
                                                        <div className={`mb-2 p-4 rounded-3 bg-white`} key={key}>
                                                            <div  key={key}  className={'d-flex justify-content-between'}>

                                                                <div>
                                                                    <div className="form-check">
                                                                        <input className="form-check-input" type="checkbox" checked={selected} value="1"
                                                                               id={`checkbox${key}`} onChange={(e)=>handleCheckboxChange(key,e)}  />
                                                                        <label className="form-check-label" htmlFor={`checkbox${key}`}>
                                                                            {`${name}`}
                                                                        </label>
                                                                    </div>
                                                                    <div>

                                                                    </div>
                                                                </div>



                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }


                                            <div className={'mt-5'}>
                                                <div className={'mb-2'}>Describe your experience (optional)</div>
                                                <Field name="comment" validate={ required}>
                                                    {({input, meta}) => (
                                                        <div className="input-wrp">
                                                            <textarea className="textfield textfield3"  type="text" {...input}
                                                                   placeholder="Add your comment"/>
                                                        </div>
                                                    )}
                                                </Field>
                                            </div>


                                            <div>
                                                <button
                                                    className="w-100 custom-btn custom-btn--large custom-btn--style-1"
                                                    style={{height:45}}
                                                    onClick={() => {

                                                        handleSubmit(values)

                                                    }} type="button" role="button">
                                                    Continue
                                                </button>
                                            </div>

                                        </div>

                                    </form>
                                )}
                            />


                        </div>
                    </div>
                </div>

            </div>

                <Footer/>
            </>
        </BodyClassName>
    )


}


const mapStateToProps = (state) => {
    return {
        general: state.restaurantDetail?.general
    }
}

export default connect(mapStateToProps)(Index);
