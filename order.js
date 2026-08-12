const memberSelect =
    document.getElementById("member");

const productSelect =
    document.getElementById("productType");

const quantityInput =
    document.getElementById("quantity");

const totalElement =
    document.getElementById("total");

const orderForm =
    document.getElementById("orderForm");


// ==========================================
// FORMAT RUPIAH
// ==========================================

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


// ==========================================
// LOAD MEMBER
// ==========================================

async function loadMembers() {

    const {
        data,
        error
    } = await supabaseClient
        .from("members")
        .select("*")
        .eq("active", true)
        .order("name");

    if (error) {

        console.error(error);

        alert(
            "Gagal mengambil data member."
        );

        return;
    }


    data.forEach(member => {

        const option =
            document.createElement("option");

        option.value = member.id;

        option.textContent =
            member.name;

        memberSelect.appendChild(option);

    });

}


// ==========================================
// HITUNG TOTAL
// ==========================================

function calculateTotal() {

    const selected =
        productSelect.options[
            productSelect.selectedIndex
        ];

    if (!selected) {

        totalElement.textContent =
            formatRupiah(0);

        return;
    }


    const price =
        Number(
            selected.dataset.price || 0
        );


    const quantity =
        Number(
            quantityInput.value
        );


    const total =
        price * quantity;


    totalElement.textContent =
        formatRupiah(total);

}


// ==========================================
// QUANTITY
// ==========================================

document
    .getElementById("minus")
    .addEventListener(
        "click",
        () => {

            let value =
                Number(
                    quantityInput.value
                );

            if (value > 1) {

                value--;

                quantityInput.value =
                    value;

                calculateTotal();

            }

        }
    );


document
    .getElementById("plus")
    .addEventListener(
        "click",
        () => {

            let value =
                Number(
                    quantityInput.value
                );

            if (value < 20) {

                value++;

                quantityInput.value =
                    value;

                calculateTotal();

            }

        }
    );


productSelect
    .addEventListener(
        "change",
        calculateTotal
    );


// ==========================================
// SUBMIT ORDER
// ==========================================

orderForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const submitButton =
            document.getElementById(
                "submitButton"
            );


        submitButton.disabled = true;

        submitButton.textContent =
            "MEMPROSES...";


        try {

            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const whatsapp =
                document
                    .getElementById(
                        "whatsapp"
                    )
                    .value
                    .trim();


            const note =
                document
                    .getElementById(
                        "note"
                    )
                    .value
                    .trim();


            const memberId =
                Number(
                    memberSelect.value
                );


            const productType =
                productSelect.value;


            const quantity =
                Number(
                    quantityInput.value
                );


            const selected =
                productSelect.options[
                    productSelect.selectedIndex
                ];


            const price =
                Number(
                    selected.dataset.price
                );


            const total =
                price * quantity;


            if (
                !customerName ||
                !whatsapp ||
                !memberId ||
                !productType
            ) {

                throw new Error(
                    "Mohon lengkapi semua data."
                );

            }


            // ==================================
            // GENERATE ORDER NUMBER
            // ==================================

            const {
                data: orderNumberData,
                error:
                    orderNumberError
            } = await supabaseClient.rpc(
                "create_order_number"
            );


            if (orderNumberError) {

                throw orderNumberError;

            }


            const orderNumber =
                orderNumberData;


            // ==================================
            // INSERT ORDER
            // ==================================

            const {
                data: order,
                error: orderError
            } = await supabaseClient
                .from("orders")
                .insert({

                    order_number:
                        orderNumber,

                    customer_name:
                        customerName,

                    whatsapp:
                        whatsapp,

                    note:
                        note,

                    total_amount:
                        total

                })
                .select()
                .single();


            if (orderError) {

                throw orderError;

            }


            // ==================================
            // INSERT ITEM
            // ==================================

            const {
                error: itemError
            } = await supabaseClient
                .from("order_items")
                .insert({

                    order_id:
                        order.id,

                    member_id:
                        memberId,

                    product_type:
                        productType,

                    quantity:
                        quantity,

                    price:
                        price,

                    subtotal:
                        total

                });


            if (itemError) {

                throw itemError;

            }


            // ==================================
            // SUCCESS
            // ==================================

            localStorage.setItem(
                "deluna_last_order",
                orderNumber
            );


            window.location.href =
                "check-order.html?order=" +
                encodeURIComponent(
                    orderNumber
                );


        } catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Order gagal dibuat."
            );


            submitButton.disabled =
                false;

            submitButton.textContent =
                "ORDER SEKARANG";

        }

    }
);


// ==========================================
// START
// ==========================================

loadMembers();

calculateTotal();
