export default class OneClass {
    public $self: HTMLDivElement;

    constructor() {
        this.$self = <HTMLDivElement>document.querySelector("#text--s--");
    }

    public setText(text: string): void {
        this.$self.textContent = text;
    }

}
