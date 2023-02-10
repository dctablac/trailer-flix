import React from "react";

export default function InfoTable(props) {
    const {
        info
    } = props;

    function formatObjectList(list) {
        return list.map(item => item.name).join(', ');
    }
    
    function formatMoney(money) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
        return formatter.format(money);
    }

    return (
        <table className="info-container">
                <tbody>
                    <tr>
                        <td className="info-overview" colSpan={2}>{info.overview}</td>
                    </tr>
                    <tr>
                        <td>Released:</td>
                        <td>{info.release_date}</td>
                    </tr>
                    <tr>
                        <td>Revenue:</td>
                        <td>{formatMoney(info.revenue)}</td>
                    </tr>
                    <tr>
                        <td>Genres:</td>
                        <td>{formatObjectList(info.genres)}</td>
                    </tr>
                    <tr>
                        <td>Budget:</td>
                        <td>{formatMoney(info.budget)}</td>
                    </tr>
                    <tr>
                        <td>Production:</td>
                        <td>{formatObjectList(info.production_companies)}</td>
                    </tr>
                    <tr>
                        <td>Runtime:</td>
                        <td>{`${info.runtime} minutes`}</td>
                    </tr>
                </tbody>
            </table>
    );
}