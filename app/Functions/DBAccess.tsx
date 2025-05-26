import Hashes from "jshashes";
import { supabase } from "../../supabaseClient";
import { formatDatestring, getLastYearString } from "./Dates";
import type {
  FFBusiness,
  FFClient,
  FFInvoice,
  FFProject,
  FFSimpleInvoice,
  FFExpense,
  InvoiceItemType,
  BusinessAttribute,
  ProjectAttribute,
  FFProfile,
  FFContract,
  FFProjectDate,
  FFProjectDeliveryDate,
  ProfileAttribute,
  FFBulkImport,
  FFBulkImportAttribute,
  FFImportType,
} from "../assets/Types";
import type { Op } from "quill";

const MD5 = new Hashes.MD5();

export async function insertError(
  err,
  fnc,
  dta,
  redirect: string | null = "/404",
  suppress = false
) {
  const errorJSON = {
    code: err.code,
    details: err.details,
    hint: err.hint,
    message: err.message,
    function: fnc,
    data: dta,
  };

  if (process.env.NODE_ENV == "development") {
    console.error(
      "Caught error in DB access",
      JSON.stringify(errorJSON)
    );
    return err;
  }

  let { error } = await supabase
    .schema("logs")
    .from("errors")
    .insert(errorJSON);

  if (error) {
    await supabase.schema("logs").from("errors").insert({
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
      function: "insertError",
      data: null,
    });
  }

  return err;
}

export async function logEvent(typ, det, js) {
  let { error } = await supabase
    .schema("logs")
    .from("logs")
    .insert({ type: typ, details: det, json: js });

  if (error) {
    insertError(
      error,
      Error().stack?.toString(),
      { typ, det, js },
      null,
      true
    );
    throw error;
  }
}

/* -------------------- sign in ---------------------------------*/

/********************************
 * Sign in with google calendar
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      scopes: "https://www.googleapis.com/auth/calendar",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw await insertError(error, "signInWithGoogle", {});
  }

  return data;
}

/* ---------------------- Fetch Functions ---------------------- */

export async function fetchClients(): Promise<FFClient[]> {
  let { data, error } = await supabase
    .from("clients")
    .select()
    .order("name");

  if (error) {
    throw await insertError(error, "fetchClients", null, null);
  }

  return data as FFClient[];
}

export async function fetchProjects(
  includeIncomplete
): Promise<FFProject[] | null> {
  let query = supabase.from("projects").select(
    `id, created_at, name, priority, status, project_delivery_date, next_due, is_complete, notes_delta, notes, project_date, documents,
        clients (id, created_at, name, phone, email, nickname, user_id)`
  );

  if (!includeIncomplete) {
    query = query.eq("is_complete", false);
  }
  query
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  let { data, error } = await query;

  if (error) {
    throw await insertError(error, "fetchProjects", {
      includeIncomplete: includeIncomplete || null,
    });
  }
  return data;
}

export async function fetchFeedback() {
  const { data, error } = await supabase.from("feedback").select();

  if (error) {
    console.log(error);
    return;
  }

  return data;
}

export async function fetchProject(id): Promise<FFProject> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `id, created_at, name, priority, status, project_delivery_date, next_due, is_complete, notes, notes_delta, project_date, documents,
        clients (id, created_at, name, nickname, email, phone, user_id)`
    )
    .eq("id", id)
    .single();

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {
      id: id,
    });
  }
  return data;
}

export async function fetchMonthInvoices() {
  let query = supabase
    .from("invoices")
    .select("date, value:total_amount.sum()")
    .eq("isInvoice", true)
    .order("date");

  const { data, error } = await query;

  if (error) {
    throw await insertError(error, Error().stack?.toString(), null);
  }
  return data;
}

/**********************************************
 * Fetch all invoices and quotes for a project
 * @param projId The id of the project
 * @returns An array of invoices
 */
export async function fetchInvoicesForProject(
  projId: number
): Promise<FFInvoice[]> {
  let query = supabase
    .from("invoices")
    .select()
    .eq("project_id", projId);

  const { data, error } = await query;

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {
      projId: projId,
    });
  }
  return data;
}

export async function fetchInvoice(invoiceId): Promise<FFInvoice> {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      ` id, 
        created_at, 
        date, 
        invoice_items, 
        total_amount, 
        invoice_number, 
        due_date, 
        total_paid, 
        location, 
        show_gst, 
        description, 
        message, 
        outstanding_balance,
        isInvoice,
        isPaid,
        contract_id,
        projects (id, name, is_complete,
        clients(id, name, nickname, email, phone))`
    )
    .eq("id", invoiceId)
    .single();

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {
      invoiceId: invoiceId,
    });
  }

  (data.invoice_items as InvoiceItemType[]).forEach((item) => {
    /*@ts-ignore*/
    item.total = parseFloat(item.total);
    /*@ts-ignore*/
    item.unit_cost = parseFloat(item.unit_cost);
    /*@ts-ignore*/
    item.quantity = parseFloat(item.quantity);
  });

  return data as FFInvoice;
}

export async function fetchBusiness(): Promise<FFBusiness> {
  const { data, error } = await supabase
    .from("businesses")
    .select()
    .maybeSingle();

  if (error) {
    throw await insertError(error, Error().stack?.toString(), null);
  } else {
    return data;
  }
}

export async function fetchExpenses(
  orderColumn?
): Promise<FFExpense[]> {
  let oc = orderColumn || "date";
  const { data, error } = await supabase
    .from("expenses")
    .select(
      `id, created_at, date, description, category, amount, is_deductible, url, user_id, file,
        recurring_expenses(id, frequency, end_date)`
    )
    .order(oc, { ascending: false })
    .gte("date", getLastYearString());

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {
      orderColumn: oc,
    });
  } else {
    return data;
  }
}

export async function fetchRecurringExpenses() {
  const { data, error } = await supabase
    .from("recurring_expenses")
    .select()
    .gte("end_date", formatDatestring(new Date()));

  if (error) {
    insertError(error, Error().stack?.toString(), null);
  } else {
    return data;
  }
}

export async function fetchExpensesByCategory() {
  const { data, error } = await supabase
    .from("expenses")
    .select("category, value:amount.sum()");

  if (error) {
    throw await insertError(error, Error().stack?.toString(), null);
  } else {
    return data;
  }
}

export async function fetchActiveProjects(): Promise<FFProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("is_complete", false);

  if (error) {
    throw await insertError(error, Error().stack?.toString(), null);
  }

  return data;
}

export async function fetchGear() {
  const { data, error } = await supabase
    .from("gear")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    throw await insertError(error, Error().stack?.toString(), null);
  }
  return data;
}

export async function fetchUserBusiness(uid) {
  const { data, error } = await supabase
    .from("businesses")
    .select(
      `id, name, abn, street_number, street, suburb, state, postcode, email, phone, bsb_num, pay_id, account_num, invoice_count, rate, logo,
        profiles(first_name, last_name, user_name, allow_email)`
    )
    .maybeSingle();

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {
      uid: uid,
    });
  }
  return data;
}

/**
 * Get a user's profile from the database
 * @param uid The id of the user
 * @returns The user profile
 * @throws Error
 */
export async function fetchUserProfile(
  uid: string
): Promise<FFProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", uid)
    .maybeSingle();

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {
      uid: uid,
    });
  }

  return data;
}

export async function fetchContract(id): Promise<FFContract> {
  const { data, error } = await supabase
    .from("contracts")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {
      id: id,
    });
  }

  return data;
}

export async function fetchContracts(): Promise<FFContract[]> {
  const { data, error } = await supabase
    .from("contracts")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {});
  }

  return data;
}

export async function fetchErrors(limit, dateRange, showClosed) {
  const { data, error } = await supabase
    .schema("logs")
    .from("errors")
    .select()
    .limit(limit)
    .lte("created_at", dateRange.start)
    .gte("created_at", dateRange.end)
    .eq("is_closed", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    throw await insertError(error, Error().stack?.toString(), {});
  }

  return data;
}

export async function fetchLogs(limit, dateRange) {
  const { data, error } = await supabase
    .schema("logs")
    .from("logs")
    .select()
    .limit(limit)
    .lte("created_at", dateRange.start)
    .gte("created_at", dateRange.end)
    .order("created_at", { ascending: false });

  if (error) {
    throw await insertError(error, Error().stack?.toString(), {});
  }
  return data;
}

/***********************************************
 * Fetch only invoices which are type of invoice
 * @returns An array with the invoices
 */
export async function fetchAllInvoices(): Promise<FFSimpleInvoice[]> {
  let query = supabase
    .from("invoices")
    .select(
      `id, 
      created_at, 
      date, 
      total_amount, 
      invoice_number,
      isInvoice,
      isPaid,
      due_date,
      projects (id, name, is_complete, clients(id, created_at, name, nickname, email, phone, user_id))`
    )
    .eq("isInvoice", true)
    .order("date", { ascending: false })
    .gte("date", getLastYearString());

  const { data, error } = await query;

  if (error) {
    throw await insertError(error, Error().stack?.toString(), null);
  }
  return data;
}

export async function fetchFile(file): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from("expense_pdfs")
    .download(file);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { file: file },
      null
    );
  }

  return data;
}

export async function fetchImportHistory(): Promise<FFBulkImport[]> {
  const { data, error } = await supabase
    .from("bulk_imports")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    throw await insertError(
      error,
      "DBACCESS::fetchImportHistory",
      {},
      null
    );
  }

  return data;
}
/* ---------------------- Insert Functions ---------------------- */

export async function insertClient(
  nm: string,
  nickname?: string,
  phone?: string,
  email?: string
): Promise<FFClient> {
  const { data, error } = await supabase
    .from("clients")
    .insert({ name: nm, nickname, email, phone })
    .select()
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { nm: nm },
      null
    );
  }
  return data;
}

export async function insertProject(pri) {
  const { data, error } = await supabase
    .from("projects")
    .insert({
      priority: pri,
    })
    .select()
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { pri },
      null
    );
  }
  return data;
}

/********************************
 * Insert a new invoice or quote
 * @returns The ID of the inserted invoice
 */
export async function insertInvoice(
  date,
  items: InvoiceItemType[] | null,
  pId,
  tAm,
  iNm,
  bId,
  dueDate,
  description,
  totalPaid,
  outstandingBalance,
  location,
  message,
  showGst,
  isInvoice,
  contractId: number | null
): Promise<number> {
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      date: date,
      invoice_items: items,
      project_id: pId,
      total_amount: tAm,
      invoice_number: iNm,
      due_date: dueDate,
      description,
      total_paid: totalPaid,
      outstanding_balance: outstandingBalance,
      location: location,
      message,
      show_gst: showGst,
      isInvoice: isInvoice,
      contract_id: contractId,
    })
    .select("id")
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      {
        date,
        items,
        pId,
        tAm,
        iNm,
        bId,
        dueDate,
        description,
        totalPaid,
        outstandingBalance,
        location,
        message,
        showGst,
        isInvoice,
      },
      null
    );
  }
  if (isInvoice == true)
    await supabase.rpc("increment_invoice_count", { row_id: bId });
  return data.id;
}

export async function insertBusiness() {
  const { data, error } = await supabase
    .from("businesses")
    .insert({
      name: null,
      abn: null,
      street_number: null,
      street: null,
      suburb: null,
      state: null,
      postcode: null,
      email: null,
      phone: null,
      account_num: null,
      pay_id: null,
    })
    .select()
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      {},
      null
    );
  }
  return data;
}

export async function insertExpense(
  dt,
  dsc,
  cat,
  amt,
  dct,
  rId,
  url
) {
  const { data, error } = await supabase
    .from("expenses")
    .upsert({
      date: dt,
      description: dsc,
      category: cat,
      amount: amt,
      is_deductible: dct,
      recurring_id: rId,
      url: url,
    })
    .select()
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { dt, dsc, cat, amt, dct, rId, url },
      null
    );
  } else {
    return data;
  }
}

/****************************************************
 * Insert a new row into the bulk_expenses DB table
 * @param type The type of bulk import
 * @param rows The number of rows imported
 * @returns The id of the bulk expense
 */
export async function insertBulkImport(
  type: FFImportType,
  rows: number
): Promise<number> {
  const { data, error } = await supabase
    .from("bulk_imports")
    .insert({ import_type: type, num_rows: rows })
    .select("id")
    .single();

  if (error) {
    throw await insertError(error, "DBAccess::insertBulkExpense", {
      type,
      rows,
    });
  }

  return data.id as number;
}

/**************************************
 * Bulk insert a list of expenses
 */
export async function bulkInsertExpenses(expenses: FFExpense[]) {
  const { data, error } = await supabase
    .from("expenses")
    .insert(expenses);

  if (error) {
    throw await insertError(
      error,
      "DBAccess::bulkInsertExpenses",
      { expenses },
      null
    );
  }

  return true;
}

/**************************************
 * Bulk insert a list of clients
 */
export async function bulkInsertClients(
  clients: FFClient[]
): Promise<FFClient[]> {
  const { data, error } = await supabase
    .from("clients")
    .insert(clients)
    .select();

  if (error) {
    throw await insertError(
      error,
      "DBAccess::bulkInsertClients",
      { clients },
      null
    );
  }

  return data;
}

/**************************************
 * Bulk insert a list of projects
 */
export async function bulkInsertProjects(
  projects: FFProject[]
): Promise<FFProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .insert(projects)
    .select();

  if (error) {
    throw await insertError(
      error,
      "DBAccess::bulkInsertProjects",
      { projects },
      null
    );
  }

  return data;
}

/**************************************
 * Bulk insert a list of invoices
 */
export async function bulkInsertInvoices(invoices: FFInvoice[]) {
  const { data, error } = await supabase
    .from("invoices")
    .insert(invoices);

  if (error) {
    throw await insertError(
      error,
      "DBAccess::bulkInsertInvoices",
      { invoices },
      null
    );
  }

  return true;
}

export async function insertRecurringExpense(
  dsc,
  cat,
  amt,
  dct,
  url,
  sDt,
  eDt,
  frq
) {
  const { data, error } = await supabase
    .from("recurring_expenses")
    .insert({ start_date: sDt, end_date: eDt, frequency: frq })
    .select()
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { dsc, cat, amt, dct, url, sDt, eDt, frq },
      null
    );
  } else {
    return await insertExpense(sDt, dsc, cat, amt, dct, data.id, url);
  }
}

export async function insertGear(nm, cph, dte, avl) {
  const { data, error } = await supabase.from("gear").insert({
    name: nm,
    cost_per_hour: cph,
    date_bought: dte,
    is_available: avl,
  });

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { nm, cph, dte, avl },
      null
    );
  } else {
    return true;
  }
}

export async function insertFeedback(cat, val) {
  const { data, error } = await supabase
    .from("feedback")
    .insert({ category: cat, value: val });

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { cat, val },
      null
    );
  }

  return true;
}

export async function uploadExpenseFile(eId, file, uId) {
  const fileHash = MD5.hex(MD5.hex(eId + new Date().toISOString()));
  const { data, error } = await supabase.storage
    .from("expense_pdfs")
    .upload(`${uId}/expense_${fileHash}`, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { eId, file, uId },
      null
    );
  }
  return data;
}

export async function uploadBusinessLogo(uId, bId, file) {
  const fileName = MD5.hex(file.name + new Date().toISOString());

  const { data, error } = await supabase.storage
    .from("business_logos")
    .upload(`${uId}/${fileName}`, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { uId, bId, file },
      null
    );
  }

  return await fetchLogoUrl(uId, fileName);
}

export async function fetchLogoUrl(uId, fName) {
  const { data } = await supabase.storage
    .from("business_logos")
    .getPublicUrl(`${uId}/${fName}`);
  return data.publicUrl;
}

export async function insertContract(
  ops,
  label: string
): Promise<FFContract | null> {
  const { data, error } = await supabase
    .from("contracts")
    .insert({ ops, label })
    .select()
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { ops, label },
      null
    );
  }
  return data;
}

/* ---------------------- Update Functions ---------------------- */
export async function updateBusiness(
  bId,
  nm,
  abn,
  stNm,
  str,
  sb,
  sta,
  pc,
  ema,
  ph,
  accName,
  acc,
  paId,
  bsb
) {
  const { error } = await supabase
    .from("businesses")
    .update({
      name: nm,
      abn: abn,
      street_number: stNm,
      street: str,
      suburb: sb,
      state: sta,
      postcode: pc,
      email: ema,
      phone: ph,
      account_num: acc,
      pay_id: paId,
      bsb_num: bsb,
      account_name: accName,
    })
    .eq("id", bId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      {
        bId,
        nm,
        abn,
        stNm,
        str,
        sb,
        sta,
        pc,
        ema,
        ph,
        acc,
        paId,
        bsb,
        accName,
      },
      null
    );
  } else {
    return true;
  }
}

export async function updateInvoiceSettings(bId, rMo, pre, cnt) {
  const { error } = await supabase
    .from("businesses")
    .update({
      invoice_reset_monthly: rMo,
      invoice_prefix: pre,
      invoice_count: cnt,
    })
    .eq("id", bId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { bId, rMo, pre, cnt },
      null
    );
  }

  return true;
}

export async function updateBusinessLogo(bId, logo) {
  const { error } = await supabase
    .from("businesses")
    .update({ logo: logo })
    .eq("id", bId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { bId, logo },
      null
    );
  } else {
    return true;
  }
}

export async function updateRates(bId, rt) {
  const { error } = await supabase
    .from("businesses")
    .update({ rate: rt })
    .eq("id", bId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { bId, rt },
      null
    );
  } else {
    return true;
  }
}

export async function updateGear(gId, nm, cph, dte, avl) {
  const { error } = await supabase
    .from("gear")
    .update({
      name: nm,
      cost_per_hour: cph,
      date_bought: dte,
      is_available: avl,
    })
    .eq("id", gId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { gId, nm, cph, dte, avl },
      null
    );
  } else {
    return true;
  }
}

/**********************************
 * Update an invoice
 * @returns The invoice ID
 */
export async function updateInvoice(
  id,
  date,
  items: InvoiceItemType[] | null,
  pId,
  tAm,
  dueDate,
  description,
  totalPaid,
  outstandingBalance,
  showGst,
  message,
  location,
  isPaid,
  contractId: number | null
): Promise<number> {
  const { data, error } = await supabase
    .from("invoices")
    .update({
      id: id,
      date: date,
      invoice_items: items,
      project_id: pId,
      total_amount: tAm,
      due_date: dueDate,
      total_paid: totalPaid,
      location: location,
      show_gst: showGst,
      description: description,
      message: message,
      outstanding_balance: outstandingBalance,
      isPaid: isPaid,
      contract_id: contractId,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      {
        id,
        date,
        items,
        pId,
        tAm,
        dueDate,
        description,
        totalPaid,
        outstandingBalance,
        showGst,
        message,
        isPaid,
      },
      null
    );
  }
  return data.id;
}

export async function updateClient(id, name, nickname, phone, email) {
  const { error } = await supabase
    .from("clients")
    .update({ id, name, nickname, phone, email })
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id, name, nickname, phone, email },
      null
    );
  }

  return true;
}

export async function updateProjectAttribute(
  id: number,
  attr: ProjectAttribute,
  value
) {
  const { error } = await supabase
    .from("projects")
    .update({ [attr]: value })
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id, attr, value },
      null,
      true
    );
  } else {
    return true;
  }
}

export async function updateContract(
  id: number,
  ops: Op[],
  label: string
): Promise<FFContract> {
  const { data, error } = await supabase
    .from("contracts")
    .update({ id, ops, label })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id, ops, label },
      null
    );
  }

  return data;
}

export async function updateProject(
  id,
  name,
  priority,
  status,
  projectDate: FFProjectDate,
  deliveryDate: FFProjectDeliveryDate,
  notesDelta
) {
  const { error } = await supabase
    .from("projects")
    .update({
      name: name,
      status: status,
      priority: priority,
      project_date: projectDate,
      project_delivery_date: deliveryDate,
      notes_delta: notesDelta,
    })
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      {
        id,
        name,
        priority,
        status,
        projectDate,
        deliveryDate,
        notesDelta,
      },
      null
    );
  }

  return true;
}

/***********************************
 * Update default attributes for invoices
 * @param bId The business ID
 * @param type The attribute to update
 * @param value The value to update the attribute to
 * @returns A boolean if successful
 */
export async function updateBusinessAttribute(
  bId: number,
  attr: BusinessAttribute,
  value: any
) {
  const { error } = await supabase
    .from("businesses")
    .update({ [attr]: value })
    .eq("id", bId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { bId, attr, value },
      null
    );
  }

  return true;
}

export async function updateExpense(
  id,
  dt,
  dsc,
  cat,
  amt,
  dct,
  rcr,
  url
) {
  const { data, error } = await supabase
    .from("expenses")
    .update({
      date: dt,
      description: dsc,
      category: cat,
      amount: amt,
      is_deductible: dct,
      recurring_id: rcr,
      url: url,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id, dt, dsc, cat, amt, dct, rcr, url },
      null
    );
  } else {
    return data;
  }
}

/********************************************
 * Update a field in the bulk imports table
 * @param id The row to update
 * @param attr The attribute to update
 * @param value The value to update the attribute to
 */
export async function updateBulkImportAttribute(
  id: number,
  attr: FFBulkImportAttribute,
  value
) {
  const { error } = await supabase
    .from("bulk_imports")
    .update({ [attr]: value })
    .eq("id", id);

  if (error) {
    throw insertError(error, "DbAccess::updateBulkImportAttribute", {
      id,
      attr,
      value,
    });
  }
  return true;
}

export async function updateExpenseFile(
  id: number,
  file: string | null
) {
  const { error } = await supabase
    .from("expenses")
    .update({ file: file })
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id, file },
      null
    );
  }

  return true;
}

export async function updateRecurringExpense(id, eDt, frq) {
  const { error, data } = await supabase
    .from("recurring_expenses")
    .update({ end_date: eDt, frequency: frq })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id, eDt, frq },
      null
    );
  }
  return data;
}

export async function updateUserProfile(
  id: string,
  fn: string | null,
  ln: string | null,
  em: boolean,
  newFeaturesRead: boolean
) {
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: fn,
      last_name: ln,
      allow_email: em,
      new_features_read: newFeaturesRead,
    })
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id, fn, ln, em },
      null
    );
  }

  return true;
}

export async function updateProfileAttribute(
  id,
  attr: ProfileAttribute,
  value
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ [attr]: value })
    .eq("id", id);

  if (error) {
    throw await insertError(error, "updateProfileAttribute", {
      id,
      attr,
      value,
    });
  }
  return true;
}

export async function patchProfile(
  id: string,
  attr: ProfileAttribute,
  value: any
) {
  const { error } = await supabase
    .from("profiles")
    .update({ [attr]: value })
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      "DBAccess: PatchProfile",
      { id, attr, value },
      null
    );
  }

  return true;
}

export async function updateUserRole(rol) {
  const { data, error } = await supabase.auth.updateUser({
    data: { role: rol },
  });

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { rol },
      null
    );
  }

  return true;
}

export async function updateErrorAttribute(id, att, val) {
  let query: any = supabase.schema("logs").from("errors");

  if (att == "is_flagged") query = query.update({ is_flagged: val });
  else if (att == "is_closed")
    query = query.update({ is_closed: val });
  else throw Error("Invalid attribute given");

  const { error } = await query.eq("id", id);

  if (error) {
    console.log(error);
    throw Error("An issue occured updating the ".concat(att));
  }

  return true;
}

/* ---------------------- Delete Functions ---------------------- */
export async function deleteGear(gId) {
  const { error } = await supabase
    .from("gear")
    .delete()
    .eq("id", gId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { gId },
      null
    );
  }

  return true;
}

export async function deleteProject(pId) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", pId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { pId },
      null
    );
  }

  return true;
}

export async function deleteClient(cId) {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", cId);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { cId },
      null
    );
  } else {
    return true;
  }
}

export async function deleteExpense(id) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id },
      null
    );
  } else {
    return true;
  }
}

/*********************************************
 * Delete an invoice
 * @param id The ID of the invoice to delete
 * @returns True if successful
 */
export async function deleteInvoice(id: number) {
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id },
      null
    );
  }
  return true;
}

export async function deleteContract(id) {
  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", id);

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id },
      null
    );
  }

  return true;
}

/****************************
 * Delete all rows which have a specific recurring expense id
 * @param id The recurring expense id to delete
 * @returns the number of rowsx deleted
 */
export async function deleteItemsFromBulkImport(
  table: "expenses" | "invoices" | "clients" | "projects",
  id: number
) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("import_id", id)
    .select();

  if (error) {
    throw await insertError(
      error,
      "DbAccess::deleteAllReccuringExpenses",
      { id }
    );
  }

  return data.length;
}

/* ------------ postgress functions ------------------ */
export async function fetchPaymentIntent(id) {
  let { data, error } = await supabase
    .rpc("get_stripe_intent", { id_search: id })
    .maybeSingle();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id },
      null
    );
  } else return data;
}

export async function fetchStripeCustomer(id) {
  let { data, error } = await supabase
    .rpc("get_stripe_customer", { id_search: id })
    .maybeSingle();

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id },
      null
    );
  } else return data;
}

export async function fetchActiveUserSubscriptions(id) {
  let { data, error } = await supabase.rpc(
    "get_active_subscriptions",
    {
      _user_id: id,
    }
  );

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { id },
      null
    );
  }
  return data;
}

export async function getStripePaymentIntents(uId) {
  let { data, error } = await supabase.rpc(
    "get_stripe_payment_intents",
    {
      _uid: uId,
    }
  );

  if (error) {
    throw await insertError(
      error,
      Error().stack?.toString(),
      { uId },
      null
    );
  } else return data;
}

export async function handleSignOut(isRetry = false) {
  await supabase.auth.refreshSession();
  const { error } = await supabase.auth.signOut();

  if (error) {
    if (isRetry) {
      await insertError(error, "DBAccess::handleSignOut", {
        date: new Date(),
      });
      return;
    }

    await supabase.auth.refreshSession();
    handleSignOut(true);
    return;
  }

  return;
}