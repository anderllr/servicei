/**
 ** Session Slider
 **/
import React, { Component } from "react";
import Slider from "react-slick";

export default class SessionSlider extends Component {
    state = {
        sessionUsersData: null
    };

    componentDidMount() {
        this.getSessionUsersData();
    }

    // session users data
    getSessionUsersData() {
        const sessionUsersData = [
            {
                body:
                    "Traga seu controle financeiro para o Servicei, venha para um mundo de praticidade onde tudo é tratado como movimentação única, facilitando a vida de quem precisa administrar e trabalhar.",
                designation: "Movimentação Integrada",
                id: 1,
                name: "Controle Financeiro",
                profile: require("Assets/img/slider-contas.png")
            },
            {
                body:
                    "Emitir notas fiscais de serviço tem sido um fator de transtorno para você, o Servicei se integra com a maioria das prefeituras do país, venha e veja se a sua está incluída. Emita suas notas em poucos cliques.",
                designation: "Notas de Serviço e Mercadorias",
                id: 2,
                name: "Emissão de Notas Fiscais",
                profile: require("Assets/img/slider-notas.png")
            },
            {
                body:
                    "O Servicei é moderno, prático e sustentável. Utiliza-se do que há de mais novo em tecnologia no mercado para facilitar a administração de quem precisa trabalhar.",
                designation: "Novidade e Praticidade",
                id: 3,
                name: "Modernidade",
                profile: require("Assets/img/slider-novo.png")
            }
        ];

        this.setState({ sessionUsersData });
    }

    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            swipe: true,
            touchMove: true,
            swipeToSlide: true,
            draggable: true
        };
        const { sessionUsersData } = this.state;
        return (
            <div className="session-slider">
                <Slider {...settings}>
                    {sessionUsersData &&
                        sessionUsersData !== null &&
                        sessionUsersData.map((data, key) => (
                            <div key={key}>
                                <img
                                    src={data.profile}
                                    alt="session-slider"
                                    className="img-fluid"
                                    width="377"
                                    height="588"
                                />
                                <div className="rct-img-overlay">
                                    <h5 className="client-name">{data.name}</h5>
                                    <span>{data.designation}</span>
                                    <p className="mb-0 fs-14">{data.body}</p>
                                </div>
                            </div>
                        ))}
                </Slider>
            </div>
        );
    }
}
