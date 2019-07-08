export function algorithm(ctx, message) {
  let {
    P1_top,
    P1_bottom,
    P2_top,
    P2_bottom,
    M1_top,
    M1_bottom,
    M2_top,
    M2_bottom,
    Y1_top,
    Y1_bottom,
    Y2_top,
    Y2_bottom,
    L_min_top,
    L_min_bottom,
    L_max_top,
    L_max_bottom,
    M_top,
    M_bottom,
    R_top,
    R_bottom,
    S
  } = ctx.state;

  if (isValid(P1_top, P2_top, M_top)) {
    M1_top = Math.round((M_top * P2_top) / (Number(P1_top) + Number(P2_top)));
    M2_top = M_top - M1_top;
    Y1_top = P1_top * M1_top;
    Y2_top = P2_top * M2_top;
    L_max_top = Math.max(Y1_top - M_top, Y2_top - M_top);
    L_min_top = Math.min(Y1_top - M_top, Y2_top - M_top);
    R_top = L_min_top / M_top;
    return ctx.setState({
      M1_top: M1_top.toFixed(2),
      M2_top: M2_top.toFixed(2),
      Y1_top: Y1_top.toFixed(2),
      Y2_top: Y2_top.toFixed(2),
      L_max_top: L_max_top.toFixed(2),
      L_min_top: L_min_top.toFixed(2),
      R_top: R_top.toFixed(2)
    });
  }

  if (isValid(M1_top, P1_top, P2_top)) {
    M_top = Math.round((M1_top * (Number(P1_top) + Number(P2_top))) / P1_top);
    M2_top = M_top - M1_top;
    Y1_top = P1_top * M1_top;
    Y2_top = P2_top * M2_top;
    L_max_top = Math.max(Y1_top - M_top, Y2_top - M_top);
    L_min_top = Math.min(Y1_top - M_top, Y2_top - M_top);
    R_top = L_min_top / M_top;
    return ctx.setState({
      M_top: M_top.toFixed(2),
      M2_top: M2_top.toFixed(2),
      Y1_top: Y1_top.toFixed(2),
      Y2_top: Y2_top.toFixed(2),
      L_max_top: L_max_top.toFixed(2),
      L_min_top: L_min_top.toFixed(2),
      R_top: R_top.toFixed(2)
    });
  }

  if (isValid(M1_bottom, P1_bottom, R_bottom)) {
    M_bottom = Math.round((M1_bottom * P1_bottom) / (1 + Number(R_bottom)));
    M2_bottom = M_bottom - M1_bottom;
    P2_bottom = (P1_bottom * M1_bottom) / M2_bottom;
    Y1_bottom = P1_bottom * M1_bottom;
    Y2_bottom = P2_bottom * M2_bottom;
    L_max_bottom = Math.max(Y1_bottom - M_bottom, Y2_bottom - M_bottom);
    L_min_bottom = Math.min(Y1_bottom - M_bottom, Y2_bottom - M_bottom);
    S = M_bottom * R_bottom;
    return ctx.setState({
      M_bottom: M_bottom.toFixed(2),
      M2_bottom: M2_bottom.toFixed(2),
      P2_bottom: P2_bottom.toFixed(2),
      Y1_bottom: Y1_bottom.toFixed(2),
      Y2_bottom: Y2_bottom.toFixed(2),
      L_max_bottom: L_max_bottom.toFixed(2),
      L_min_bottom: L_min_bottom.toFixed(2),
      S: S.toFixed(2)
    });
  }

  if (isValid(M1_bottom, P1_bottom, S)) {
    M_bottom = Math.round(M1_bottom * P1_bottom - S);
    M2_bottom = M_bottom - M1_bottom;
    P2_bottom = (P1_bottom * M1_bottom) / M2_bottom;
    Y1_bottom = P1_bottom * M1_bottom;
    Y2_bottom = P2_bottom * M2_bottom;
    L_max_bottom = Math.max(Y1_bottom - M_bottom, Y2_bottom - M_bottom);
    L_min_bottom = Math.min(Y1_bottom - M_bottom, Y2_bottom - M_bottom);
    R_bottom = S / M_bottom;
    return ctx.setState({
      M_bottom: M_bottom.toFixed(2),
      M2_bottom: M2_bottom.toFixed(2),
      P2_bottom: P2_bottom.toFixed(2),
      Y2_bottom: Y2_bottom.toFixed(2),
      L_max_bottom: L_max_bottom.toFixed(2),
      L_min_bottom: L_min_bottom.toFixed(2),
      R_bottom: R_bottom.toFixed(2)
    });
  }

  message.info("计算失败，请检查输入内容是否符合规则");
}

function isValid(...args) {
  return args.every(item => item.length > 0);
}
