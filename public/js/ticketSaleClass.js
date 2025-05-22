export default class TicketSale {

    constructor(map) {
        this.id = map.id;
        this.date = map.date;
        this.start_time = map.start_time;
        this.end_time = map.end_time;
        this.category = map.category;
        this.total_tickets = map.total_tickets;
        this.regular_tickets = map.regular_tickets;
        this.children_tickets = map.children_tickets;
        this.studentTickets = map.studentTickets;
        this.name = map.name;
        this.email = map.email;
    }

    shouldDisplay(search, date, time, category) {
        if (date.length > 0) date = new Date(date).toLocaleDateString()
        console.log(time);
        let show = 0b0000
        if(search.length > 0){
            const searchLower = search.toLowerCase();
            if (
                this.name.toLowerCase().includes(searchLower) ||
                this.email.toLowerCase().includes(searchLower) ||
                this.id == searchLower
            ) {
                show |= 0b1000;
            }
        } else show |= 0b1000;
        if(date.length > 0){
            if(this.date == date) show |= 0b0100;
        } else show |= 0b0100;
        if(time.length > 0){
            time = time + ":00";
            if(this.start_time <= time && this.end_time >= time) show |= 0b0010;
        } else show |= 0b0010;
        if(category == "Όλες οι κατηγορίες") show |= 0b0001;
        else if (this.category == category) show |= 0b0001;
        console.log(show)
        return show === 0b1111;
    }
}
