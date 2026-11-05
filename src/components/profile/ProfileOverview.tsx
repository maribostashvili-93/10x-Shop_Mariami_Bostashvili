import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import { useWishlist } from "../../hooks/useWishlist";
import { useNow } from "../../hooks/useNow";
import OrderStatusBadge from "../orders/OrderStatusBadge";
import { Cart, PROMO_CODES } from "../../models/Cart";
import { reviewStorage } from "../../services/reviewStorage";
import { DEALS_MIN_DISCOUNT } from "../../utils/url";
import { formatDate, formatPrice } from "../../utils/formatPrice";

type ProfileOverviewProps = {
  onEdit: () => void;
};

type Activity = {
  id: string;
  date: string;
  title: string;
  detail: string;
  to?: string;
  icon: string;
};

const ICONS = {
  calendar: "M7 3v3M17 3v3M4 9h16M5 5h14v15H5z",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM9 10a3 3 0 1 0 6 0 3 3 0 1 0-6 0",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  bag: "M6 7h12l1 14H5L6 7Zm3 0a3 3 0 0 1 6 0",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9Z",
  heart: "M12 21 3.5 12.5a5.5 5.5 0 0 1 8.5-7 5.5 5.5 0 0 1 8.5 7Z",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-1a7 7 0 0 1 14 0v1",
  check: "m5 12 4 4L19 6",
  edit: "M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4",
} as const;

function Icon({ path, className = "size-4" }: { path: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <path d={path} />
    </svg>
  );
}

function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const id = `profile-${title.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <section aria-labelledby={id} className={`rounded-3xl border border-violet-100 bg-white p-6 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="text-lg font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Overview tab: everything here comes from this shopper's real orders, reviews, wishlist and profile. */
function ProfileOverview({ onEdit }: ProfileOverviewProps) {
  const { user, profile } = useAuth();
  const { orders } = useOrders();
  const { products: wishlist } = useWishlist();
  const now = useNow(30_000);
  const [reviews] = useState(() => reviewStorage.load());
  const username = user?.username ?? "";

  const myReviews = useMemo(
    () => Object.entries(reviews).flatMap(([productId, list]) =>
      list.filter((review) => review.reviewerName === username).map((review) => ({ ...review, productId }))),
    [reviews, username],
  );

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || username;
  const latestOrder = orders[0];
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const promo = PROMO_CODES["10X10"];

  // Newest first: orders, reviews, profile changes and the day the shopper joined.
  const activity = useMemo<Activity[]>(() => {
    const items: Activity[] = [
      ...orders.map((order) => ({
        id: `order-${order.id}`,
        date: order.placedAt,
        title: `Order #${order.number} placed`,
        detail: `${order.itemCount} ${order.itemCount === 1 ? "item" : "items"} · ${formatPrice(order.total)}`,
        to: `/orders/${order.id}`,
        icon: ICONS.bag,
      })),
      ...myReviews.map((review) => ({
        id: `review-${review.productId}-${review.date}`,
        date: review.date,
        title: `You rated a product ${review.rating}/5`,
        detail: `“${review.comment.length > 48 ? `${review.comment.slice(0, 48)}…` : review.comment}”`,
        to: `/products/${review.productId}`,
        icon: ICONS.star,
      })),
      ...(profile.updatedAt ? [{ id: "profile-updated", date: profile.updatedAt, title: "Profile updated", detail: "Personal details saved", icon: ICONS.user }] : []),
      ...(profile.memberSince ? [{ id: "joined", date: profile.memberSince, title: "Joined 10X Shop", detail: "Welcome aboard", icon: ICONS.heart }] : []),
    ];
    return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [orders, myReviews, profile.updatedAt, profile.memberSince]);

  const details = [
    { icon: ICONS.calendar, label: "Member since", value: profile.memberSince ? formatDate(profile.memberSince) : "Today" },
    { icon: ICONS.pin, label: "City", value: latestOrder?.shipping.city ?? "Added at your first checkout" },
    { icon: ICONS.mail, label: "Email", value: profile.email || "Not added yet" },
    { icon: ICONS.phone, label: "Phone", value: profile.phone || "Not added yet" },
  ];

  const stats = [
    { label: "Orders", value: String(orders.length), to: "/orders" },
    { label: "Total spent", value: formatPrice(totalSpent), to: "/orders" },
    { label: "Wishlist", value: String(wishlist.length), to: "/wishlist" },
    { label: "Reviews", value: String(myReviews.length) },
  ];

  return (
    <div className="space-y-6">
      {/* Identity card */}
      <section aria-labelledby="profile-name" className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white">
        <div aria-hidden="true" className="h-24 bg-gradient-to-r from-violet-200 via-violet-100 to-sky-100 sm:h-28" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <span aria-hidden="true" className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-400 text-4xl font-bold text-white ring-4 ring-white">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <button type="button" onClick={onEdit} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-800 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
              <Icon path={ICONS.edit} /> Edit profile
            </button>
          </div>
          <h1 id="profile-name" className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">{displayName}</h1>
          <p className="mt-1 text-sm text-slate-600">@{username}</p>
          <ul aria-label="Profile details" className="mt-5 grid gap-3 sm:grid-cols-2">
            {details.map((detail) => (
              <li key={detail.label} className="flex min-w-0 items-center gap-3 text-sm">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon path={detail.icon} /></span>
                <p className="min-w-0">
                  <span className="block text-xs text-slate-600">{detail.label}</span>
                  <span className="block truncate font-medium text-slate-900">{detail.value}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Stats */}
      <ul aria-label="Account summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const content = (
            <>
              <span className="block text-sm text-slate-600">{stat.label}</span>
              <span className="mt-1 block text-2xl font-bold text-violet-800">{stat.value}</span>
            </>
          );
          return (
            <li key={stat.label}>
              {stat.to ? (
                <Link to={stat.to} className="block h-full rounded-2xl bg-violet-50 p-5 transition hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-700">{content}</Link>
              ) : (
                <div className="h-full rounded-2xl bg-violet-50 p-5">{content}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Orders timeline */}
        <Panel
          title="My orders"
          action={orders.length > 0 ? <Link to="/orders" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-700 hover:text-violet-900">View all <span aria-hidden="true" className="ml-1">→</span></Link> : undefined}
        >
          {orders.length === 0 ? (
            <div className="rounded-2xl bg-violet-50 p-5">
              <p className="font-semibold text-slate-900">No orders yet.</p>
              <p className="mt-1 text-sm text-slate-600">Your orders and their delivery status will appear here.</p>
              <Link to="/products" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-violet-700 px-4 text-sm font-semibold text-white hover:bg-violet-800">Start shopping</Link>
            </div>
          ) : (
            <ol className="relative space-y-4 border-l-2 border-violet-100 pl-6">
              {orders.slice(0, 3).map((order) => {
                const firstItem = order.items[0];
                return (
                  <li key={order.id} className="relative">
                    <span aria-hidden="true" className="absolute top-5 -left-[33px] size-4 rounded-full border-4 border-white bg-violet-600" />
                    <Link to={`/orders/${order.id}`} className="flex items-center gap-4 rounded-2xl bg-violet-50/70 p-4 transition hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-700">
                      {firstItem && <img src={firstItem.product.thumbnail} alt="" width={56} height={56} loading="lazy" className="size-14 shrink-0 rounded-xl bg-white object-contain" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">Order #{order.number}</p>
                        <p className="truncate text-sm text-slate-600">{formatDate(order.placedAt)} · {order.itemCount} {order.itemCount === 1 ? "item" : "items"} · {formatPrice(order.total)}</p>
                      </div>
                      <OrderStatusBadge status={order.getStatus(new Date(now))} />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Delivery address">
            {latestOrder ? (
              <address className="text-sm not-italic leading-6 text-slate-700">
                <span className="font-semibold text-slate-900">{latestOrder.shipping.fullName}</span><br />
                {latestOrder.shipping.address}<br />
                {latestOrder.shipping.city} {latestOrder.shipping.postalCode}, {latestOrder.shipping.country}<br />
                {latestOrder.shipping.phone}
              </address>
            ) : (
              <p className="text-sm text-slate-600">Your delivery address from your first order will be shown here.</p>
            )}
          </Panel>

          {/* Member perks: every line describes a feature that exists in the shop. */}
          <section aria-labelledby="member-heading" className="keep-light rounded-3xl bg-gradient-to-br from-violet-800 to-violet-600 p-6 text-white">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-200 uppercase">10X Member</p>
            <h2 id="member-heading" className="mt-2 text-xl font-semibold">Your shopping perks</h2>
            <ul className="mt-4 space-y-2 text-sm text-violet-50">
              {[
                `Free shipping on orders from ${formatPrice(Cart.FREE_SHIPPING_FROM)}`,
                `Best deals with ${DEALS_MIN_DISCOUNT}% off or more`,
                `Promo code ${promo.code}: ${promo.percent}% off your order`,
                "Order history with live delivery status",
              ].map((perk) => (
                <li key={perk} className="flex items-start gap-2"><Icon path={ICONS.check} className="mt-0.5 size-4 text-emerald-300" />{perk}</li>
              ))}
            </ul>
            <Link to="/products?deals=1" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-violet-800 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Shop best deals
            </Link>
          </section>
        </div>
      </div>

      <Panel title="Recent activity">
        {activity.length === 0 ? (
          <p className="text-sm text-slate-600">Nothing yet — your orders and reviews will show up here.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {activity.map((item) => {
              const body = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Icon path={item.icon} className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="truncate text-sm text-slate-600">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-600">{formatDate(item.date)}</span>
                </>
              );
              return (
                <li key={item.id}>
                  {item.to ? (
                    <Link to={item.to} className="flex items-center gap-4 rounded-xl py-3 hover:bg-violet-50/60 focus-visible:outline-2 focus-visible:outline-violet-700">{body}</Link>
                  ) : (
                    <div className="flex items-center gap-4 py-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}

export default ProfileOverview;
