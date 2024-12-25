import {bottombarLinks} from "@/constant.ts";
import {Link} from "react-router-dom";

const Bottombar = () => {
    return (
        <section className="bottom-bar">
            {bottombarLinks.map((link) => {
                return (
                    <Link to={link.route} className="flex-col flex-center gap-1 p-2 transition"
                          key={link.label}>
                        <img src={link.imgURL} alt={link.label} width={16} height={16} className='invert-white'/>
                        <p className="tiny-medium text-light-2">{link.label}</p>
                    </Link>
                )
            })}
        </section>
    );
};

export default Bottombar;