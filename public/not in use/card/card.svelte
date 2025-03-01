

<script lang="ts">
    export let title:string;
    export let colors:string;
    export let angle:number;
    export let link:string;
    

</script>


    <a href={link}>
        <div>
            <img alt="display" style="background: linear-gradient({angle}deg,{colors});">
            <h3 class="title" style=" background: linear-gradient({angle}deg,{colors}); background-clip: text; color: transparent; ">{title}</h3>
            <p>
                <slot />
            </p>
        </div>
    </a>
    

    <style lang="scss">
        @import './_styles.scss';
    </style>






