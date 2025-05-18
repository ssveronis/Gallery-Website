import DB from "../db.js";

export async function getAvailTicketSearch(
    db: DB,
    categoryId:number,
    date:string,
    regular:number,
    children:number,
    students:number,
    audioguides:number,
) {
    if (!db.ready) throw new Error("Database not ready");
    const res = await db.query(`SELECT TICKETS_CATEGORY.name, view_ticket_sales_summary.id, view_ticket_sales_summary.start_time, view_ticket_sales_summary.end_time, (TICKETS_CATEGORY.regular_price*${regular} + TICKETS_CATEGORY.children_price*${children} + TICKETS_CATEGORY.student_price*${students} + TICKETS_CATEGORY.audioguide_price*${audioguides}) AS total_price FROM view_ticket_sales_summary JOIN TICKETS_CATEGORY ON view_ticket_sales_summary.category_id = TICKETS_CATEGORY.id WHERE view_ticket_sales_summary.category_id = ${categoryId} AND view_ticket_sales_summary.date = '${date}' AND view_ticket_sales_summary.max_tickets-(COALESCE(view_ticket_sales_summary.total_regular_tickets,0)+COALESCE(view_ticket_sales_summary.total_children_tickets,0)+COALESCE(view_ticket_sales_summary.total_student_tickets,0)) >= ${regular+children+students} ORDER BY view_ticket_sales_summary.start_time ASC, view_ticket_sales_summary.end_time ASC;`);
    return res.map(ticket => ({
        "name": ticket.name,
        "id": ticket.id,
        "start_time": ticket.start_time,
        "end_time": ticket.end_time,
        "total_tickets": regular + children + students,
        "total_price": ticket.total_price,
    }));
}