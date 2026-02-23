const StatCard = ({ title, value, helper }) => {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-violet-100/70" />
      <p className="relative text-sm text-slate-600">{title}</p>
      <h3 className="relative mt-1 text-2xl font-semibold text-[#27224d]">{value}</h3>
      {helper ? <p className="mt-1 text-xs text-slate-400">{helper}</p> : null}
    </div>
  );
};

export default StatCard;


