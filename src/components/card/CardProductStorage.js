import { faBuilding } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function CardProductStorage({ title, balanceStock, balanceOnDelivery, color, numLots }) {
    return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className={`card border-left-${color} shadow h-100 py-2`}>
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}>
                                {title}
                            </div>
                            <div className="h6 mb-0 font-weight-bold text-blue-800">
                                {`Stock ${balanceStock}`}
                            </div>
                            <div className="h6 mb-0 font-weight-bold text-red-800">
                                {`On-Delivery: ${balanceOnDelivery}`}
                            </div>
                            
                            {numLots ? <div className={`text-xs text-${color} text-uppercase mt-1`}>
                                {`${numLots} lot`}
                            </div> : null}
                        </div>
                        <div className="col-auto">
                            <FontAwesomeIcon icon={faBuilding} size={"2x"} style={{ color: "#dddfeb" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardProductStorage