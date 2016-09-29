import { attribute } from "aura";

const DefaultMinValue = 5;
const DefaultMaxValue = 50;

export default class Bar {
    @attribute() min = DefaultMinValue;
    @attribute() max = DefaultMaxValue;
    @attribute() label;
    @attribute() title;

    constructor() {
        this.counter = 0;
        this.itemClassName = 'item';
        this.data = [];
    }

    updated() {
        this.data = this.produceNewData(this.data);
    }

    produceNewData(oldData = []) {
        const len = Math.floor(Math.random() * (this.max - this.min)) + this.min;
        const data = [];
        for (let i = 0; i < len; i += 1) {
            if (Math.round(Math.random()) === 1 && oldData[i]) {
                data.push(oldData[i]);
            } else {
                data.push({
                    x: Math.floor(Math.random() * 100)
                });
            }
        }
        return data;
    }

    handleClick() {
        console.log('clicked');
        this.counter += 1;
    }



    // IMPORTANT: after this line, all code is generated by the build process
    // this is a generated method based on the template
    render({h,i,m,v}) {
        const iter1 = (item) => {
            return h('li', { props: { class: this.itemClassName } }, ['Value of X = ', item.x]);
        };
        const m0 = m(0, () => this.handleClick(...arguments));
        return h('div', { tabIndex: 2 }, [
            this.title ? h('h1', {}, [this.title]) : f(),
            h('ul', {}, [
                h('li', { props: { class: 'first' } }, ['header']),
                ...i(this.data, iter1),
                h('li', { props: { class: 'last' } }, ['footer']),
            ]),
            h('button', { on: { click: m0 } }, [this.label]),
        ]);
    }
}

// Example of usage:
// <Bar min="5" max="10" label="re-shuffle" />
