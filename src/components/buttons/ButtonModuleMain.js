import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

function ButtonModuleMain({ target, title, value, color, icon }) {
    return (
        <Link className="col-xl-3 col-md-6 mb-4" to={target}>
            <div className={`card border-left-${color} shadow h-100 py-2`}>
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}>
                                {value === undefined || value === null ? "" : title}
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {value === undefined || value === null ? title : value}
                            </div>
                        </div>
                        {icon ?
                        (
                            <div className="col-auto">
                            <FontAwesomeIcon icon={icon} size={"2x"} style={{ color: "#dddfeb" }} />
                        </div>
                        )
                        : null}
                    </div>
                </div>
            </div>
        </Link>
        
    )
}

export default ButtonModuleMain