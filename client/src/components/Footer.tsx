import { Link } from "react-router-dom";

const FooterLinkGroup = ({
  title,
  links,
}: {
  title: string;
  links: { name: string; url: string }[];
}) => (
  <div>
    <h4 className="text-white font-bold mb-6">{title}</h4>
    <ul className="space-y-4">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            to={link.url}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer
      id="about"
      className="w-full bg-[#0f172a] pt-16 pb-8 border-t border-gray-800"
    >
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#3b63f6] rounded-xl flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                <span className="text-[#3b63f6]">Uni</span>Market
              </h1>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Студентський маркетплейс для купівлі та продажу навчальних
              матеріалів, гаджетів, послуг та товарів між студентами українських
              університетів.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-[#3b63f6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Львів, Україна
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-[#3b63f6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                hello@unimarket.com.ua
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <svg
                  className="w-5 h-5 text-[#3b63f6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +380 (44) 000-00-00
              </div>
            </div>
          </div>

          <FooterLinkGroup
            title="Платформа"
            links={[
              { name: "Каталог", url: "/catalog" },
              { name: "Категорії", url: "/#categories" },
              { name: "Популярні", url: "/#popular" },
              { name: "Нові оголошення", url: "/catalog" }
            ]}
          />

          <FooterLinkGroup
            title="Про проєкт"
            links={[
              { name: "Про нас", url: "/#about" },
              { name: "Як це працює", url: "/#how-it-works" },
              { name: "Безпека", url: "/#security" },
              { name: "Правила", url: "/#rules" }
            ]}
          />

          <FooterLinkGroup
            title="Підтримка"
            links={[
              { name: "Центр допомоги", url: "/#help" },
              { name: "Зворотній зв'язок", url: "/#feedback" },
              { name: "Повідомити про проблему", url: "/#report" },
            ]}
          />
        </div>

        <div className="pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} UniMarket. Всі права захищені.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              Умови використання
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white transition-colors text-sm"
            >
              Політика конфіденційності
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
