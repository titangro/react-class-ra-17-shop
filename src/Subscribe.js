import React, { Component } from 'react';

class Subscribe extends Component {
    constructor(props) {
        super(props);

        this.subscribe = {
            title: 'подписаться на рассылку выгодных предложений',
            inputs: [{
                type: 'radio',
                value: 'women',
                text: 'Женское'
            },{
                type: 'radio',
                value: 'men',
                text: 'Мужское'
            },{
                type: 'radio',
                value: 'both',
                text: 'Всё',
                defaultChecked: true
            },{
                type: 'email',
                value: 'Ваш e-mail'
            },{
                type: 'submit',
                value: 'ПОДПИСАТЬСЯ'
            }]
        };

        this.state = {
            isSubscribed: false
        }
    }

    sendSubscribe = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let isValidated = false;

        for (const [k,v] of formData) {
            if (k === 'email' && v !== '')
                isValidated = true;
        }
        if (isValidated)
            this.setState({isSubscribed: true})
    }
    
    render() {
        return (
            <section className="subscribe">
                <div className="subscribe__wrapper">
                    <h2 className="subscribe__title">{this.subscribe.title}</h2>
                    {this.state.isSubscribed ? <p>Подписка оформлена! Спасибо!</p>
                    : <form className="subscribe__radios" action="" onSubmit={(event) => this.sendSubscribe(event)}>
                        {this.subscribe.inputs.map(
                            ({type, value, text, defaultChecked}, index) => 
                            {
                                return type === 'radio' ? 
                                <label className="subscribe__radio_label" key={index} >
                                    <input className="subscribe__radio" type={type} name="subscribe" value={value} defaultChecked={defaultChecked ? defaultChecked : false} />
                                    <div className="subscribe__radio_text">{text}</div>
                                </label> 
                                : <input className="subscribe__email" key={index} name={type} type={type} placeholder={value} />
                            }
                        )}                        
                    </form>}
                </div>
            </section>
        );
    }
}
        
export default Subscribe;