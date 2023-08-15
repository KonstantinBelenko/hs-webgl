export class ActionIndicator {

    public static setActive(active: boolean) {
        if (active) {
            document.getElementById('action')!.style.display = 'flex';
        } else {
            document.getElementById('action')!.style.display = 'none';
        }
    }

    public static setText(text: string) {

        let element = document.getElementById('action');
        if (element == null) {
            throw new Error('ActionIndicator not found');
        }

        element.innerHTML = text;
        element.style.fontWeight = 'bold';
        element.style.fontSize = '1.5em';
        element.style.color = 'red';
        element.style.marginTop = '50px';
    }

}